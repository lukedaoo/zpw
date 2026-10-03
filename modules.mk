# One standalone bundle per module: dist/<module>.min.{js,css}.
# Standalone: make -f modules.mk. Included by the other .mk files.
ifndef MODULES_MK
MODULES_MK := 1

ESBUILD ?= npx --yes esbuild@0.25
PANDOC ?= pandoc --from markdown --to html5 --standalone --template=build-artifact/post.html
OUT ?= dist

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
# blogs: index list + post page
blogs_JS := $(CORE)/base.js $(CORE)/container.js $(CORE)/style-control-panel.js \
	$(CORE)/go-to-top.js $(CORE)/ui.js $(CORE)/list.js src/blogs.js/blogs.js
blogs_CSS := $(CORE)/base.css $(CORE)/container.css $(CORE)/nav.css \
	$(CORE)/style-control-panel.css $(CORE)/go-to-top.css $(CORE)/ui.css src/blogs.js/blogs.css
# zpw: everything (app)
zpw_JS := $(CORE)/base.js $(CORE)/name.js $(CORE)/nav.js $(CORE)/container.js \
	$(CORE)/style-control-panel.js $(CORE)/go-to-top.js $(CORE)/list.js $(CORE)/ui.js \
	src/header.js/header.js src/footer.js/footer.js src/resume.js/resume.js \
	src/updates.js/updates.js src/blogs.js/blogs.js src/app.js/app.js
zpw_CSS := $(CORE)/base.css $(CORE)/container.css $(CORE)/name.css $(CORE)/nav.css \
	$(CORE)/style-control-panel.css $(CORE)/go-to-top.css $(CORE)/ui.css src/blogs.js/blogs.css

MODULES := header footer resume updates blogs zpw

.PHONY: modules modules-clean

modules: $(foreach m,$(MODULES),$(OUT)/$(m).min.js $(OUT)/$(m).min.css)

define MODULE_RULE
$$(OUT)/$(1).min.js: $$($(1)_JS)
	@mkdir -p $$(@D)
	cat $$^ | $$(ESBUILD) --minify --loader=js > $$@

$$(OUT)/$(1).min.css: $$($(1)_CSS)
	@mkdir -p $$(@D)
	cat $$^ | $$(ESBUILD) --minify --loader=css > $$@
endef
$(foreach m,$(MODULES),$(eval $(call MODULE_RULE,$(m))))

modules-clean:
	rm -f $(foreach m,$(MODULES),$(OUT)/$(m).min.js $(OUT)/$(m).min.css)

endif
