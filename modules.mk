# One standalone bundle per module: dist/<module>.min.{js,css}.
# Standalone: make -f modules.mk. Included by the other .mk files.
ifndef MODULES_MK
MODULES_MK := 1

ESBUILD ?= npx --yes esbuild@0.25
PANDOC ?= pandoc --from markdown --to html5 --standalone --wrap=none --template=build-artifact/post.html
OUT ?= dist
VERSION := $(strip $(file < VERSION))

# make SITE_URL=https://example.com/
SITE_URL ?=
PANDOC_SEO = -V slug=$* $(SITE_URL:%=-V siteurl=%)

SITEMAP := $(if $(SITE_URL),$(OUT)/sitemap.xml)
SITEMAP_POSTS := $(wildcard example/posts/*.md)

$(OUT)/sitemap.xml: $(SITEMAP_POSTS) build-artifact/lastmod.tpl
	@mkdir -p $(@D)
	@{ \
	  echo '<?xml version="1.0" encoding="UTF-8"?>'; \
	  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'; \
	  echo '  <url><loc>$(SITE_URL)</loc></url>'; \
	  for f in $(SITEMAP_POSTS); do \
	    slug=$$(basename $$f .md); \
	    date=$$(pandoc --from markdown --to plain --standalone \
	      --template=build-artifact/lastmod.tpl $$f | tr -d '[:space:]'); \
	    mod=""; \
	    [ -n "$$date" ] && mod="<lastmod>$$date</lastmod>"; \
	    echo "  <url><loc>$(SITE_URL)blogs/$$slug.html</loc>$$mod</url>"; \
	  done; \
	  echo '</urlset>'; \
	} > $@

# Allow all; points at the sitemap when SITE_URL is set.
ROBOTS := $(OUT)/robots.txt

$(ROBOTS): modules.mk
	@mkdir -p $(@D)
	@{ \
	  echo 'User-agent: *'; \
	  echo 'Allow: /'; \
	  $(if $(SITE_URL),echo; echo 'Sitemap: $(SITE_URL)sitemap.xml';) \
	} > $@

CORE := src/core
# Order matters: files share one global scope.
# header: name + nav
header_JS := $(CORE)/base.js $(CORE)/name.js $(CORE)/nav.js src/header.js/header.js
header_CSS := $(CORE)/base.css $(CORE)/name.css $(CORE)/nav.css
footer_JS := $(CORE)/base.js src/footer.js/footer.js
footer_CSS := $(CORE)/base.css
resume_JS := $(CORE)/base.js $(CORE)/ui.js $(CORE)/list.js src/resume.js/resume.js
resume_CSS := $(CORE)/base.css $(CORE)/ui.css
updates_JS := $(CORE)/base.js $(CORE)/ui.js $(CORE)/list.js src/updates.js/updates.js
updates_CSS := $(CORE)/base.css $(CORE)/ui.css
# seo: head tags + favicon (JS only; base.css keeps the bundle pair uniform)
seo_JS := $(CORE)/base.js src/seo.js/seo.js
seo_CSS := $(CORE)/base.css
# blogs: index list + post page
blogs_JS := $(CORE)/base.js $(CORE)/container.js $(CORE)/style-control-panel.js \
	$(CORE)/go-to-top.js $(CORE)/ui.js $(CORE)/list.js \
	src/blogs.js/blogs-code-colortheme.js src/blogs.js/blogs.js
blogs_CSS := $(CORE)/base.css $(CORE)/container.css $(CORE)/nav.css \
	$(CORE)/style-control-panel.css $(CORE)/go-to-top.css $(CORE)/ui.css src/blogs.js/blogs.css \
	src/blogs.js/blogs-code-colortheme.css
# zpw: everything (app)
zpw_JS := $(CORE)/base.js $(CORE)/name.js $(CORE)/nav.js $(CORE)/container.js \
	$(CORE)/style-control-panel.js $(CORE)/go-to-top.js $(CORE)/list.js $(CORE)/ui.js \
	src/header.js/header.js src/footer.js/footer.js src/resume.js/resume.js \
	src/updates.js/updates.js src/blogs.js/blogs-code-colortheme.js \
	src/blogs.js/blogs.js src/seo.js/seo.js src/app.js/app.js
zpw_CSS := $(CORE)/base.css $(CORE)/container.css $(CORE)/name.css $(CORE)/nav.css \
	$(CORE)/style-control-panel.css $(CORE)/go-to-top.css $(CORE)/ui.css src/blogs.js/blogs.css \
	src/blogs.js/blogs-code-colortheme.css

MODULES := header footer resume updates blogs seo zpw

.PHONY: modules modules-clean

modules: $(foreach m,$(MODULES),$(OUT)/$(m).min.js $(OUT)/$(m).min.css)

define MODULE_RULE
$$(OUT)/$(1).min.js: $$($(1)_JS)
	@mkdir -p $$(@D)
	cat $$^ | $$(ESBUILD) --minify --loader=js --banner='/*! zpw $$(VERSION) */' > $$@
	cp $$@ $$(OUT)/$(1)-$$(VERSION).min.js

$$(OUT)/$(1).min.css: $$($(1)_CSS)
	@mkdir -p $$(@D)
	cat $$^ | $$(ESBUILD) --minify --loader=css --banner='/*! zpw $$(VERSION) */' > $$@
	cp $$@ $$(OUT)/$(1)-$$(VERSION).min.css
endef
$(foreach m,$(MODULES),$(eval $(call MODULE_RULE,$(m))))

modules-clean:
	rm -f $(foreach m,$(MODULES),$(OUT)/$(m).min.js $(OUT)/$(m).min.css)

endif
