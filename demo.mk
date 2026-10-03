# Demo site for GitHub Pages: zpw bundle, example pages, compiled posts.
# Usage: make -f demo.mk
OUT := dist-github
include modules.mk

POSTS := $(wildcard example/posts/*.md)
SLUGS := $(basename $(notdir $(POSTS)))
STATIC := content.js writeup.js index.js index.css blogs-index.js

.DEFAULT_GOAL := all
.PHONY: all clean

all: $(OUT)/zpw.min.js $(OUT)/zpw.min.css $(OUT)/index.html \
	$(STATIC:%=$(OUT)/%) $(SLUGS:%=$(OUT)/blogs/%.html)

$(OUT)/blogs/%.html: example/posts/%.md build-artifact/post.html $(OUT)/zpw.min.js $(OUT)/zpw.min.css
	@mkdir -p $(@D)
	$(PANDOC) -V style=../zpw.min.css -V script=../zpw.min.js $< -o $@

$(OUT)/index.html: build-artifact/bundle.html
	@mkdir -p $(@D)
	cp $< $@

$(STATIC:%=$(OUT)/%): $(OUT)/%: example/%
	@mkdir -p $(@D)
	cp $< $@

clean:
	rm -rf $(OUT)
