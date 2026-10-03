# Release build, everything under dist/: standalone module bundles,
# demo site, posts (each loads blogs.min.*).
# Usage: make -f bundle.js.mk
include modules.mk

POSTS := $(wildcard example/posts/*.md)
SLUGS := $(basename $(notdir $(POSTS)))
STATIC := content.js writeup.js index.js index.css blogs-index.js
STANDALONE := blogs resume updates

.DEFAULT_GOAL := all
.PHONY: all clean

all: modules $(SLUGS:%=$(OUT)/blogs/%.html) $(OUT)/index.html $(STATIC:%=$(OUT)/%) $(STANDALONE:%=$(OUT)/standalone/%.js.html) $(SITEMAP) $(ROBOTS)

$(OUT)/blogs/%.html: example/posts/%.md build-artifact/post.html $(OUT)/blogs.min.js $(OUT)/blogs.min.css
	@mkdir -p $(@D)
	$(PANDOC) $(PANDOC_SEO) -V style=../blogs.min.css -V script=../blogs.min.js $< -o $@

$(OUT)/index.html: build-artifact/bundle.html
	@mkdir -p $(@D)
	cp $< $@

$(STANDALONE:%=$(OUT)/standalone/%.js.html): $(OUT)/standalone/%.js.html: build-artifact/standalone/%.js.html $(OUT)/%.min.js $(OUT)/%.min.css
	@mkdir -p $(@D)
	cp $< $@

$(STATIC:%=$(OUT)/%): $(OUT)/%: example/%
	@mkdir -p $(@D)
	cp $< $@

clean:
	rm -rf $(OUT)
