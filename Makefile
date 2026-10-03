ESBUILD := npx --yes esbuild@0.25
PANDOC := pandoc --from markdown --to html5 --standalone --template=build-artifact/post.html

POSTS := $(wildcard example/posts/*.md)
SLUGS := $(basename $(notdir $(POSTS)))

# Order matters: files share one global scope.
JS_SRC := src/core/base.js src/core/name.js src/core/nav.js src/core/container.js \
	src/core/style-control-panel.js src/core/go-to-top.js src/core/list.js src/core/ui.js \
	src/header.js/header.js src/footer.js/footer.js src/resume.js/resume.js \
	src/updates.js/updates.js src/blogs.js/blogs.js src/app.js/app.js
CSS_SRC := src/core/base.css src/core/container.css src/core/name.css src/core/nav.css \
	src/core/style-control-panel.css src/core/go-to-top.css src/core/ui.css \
	src/blogs.js/blogs.css
STATIC := content.js writeup.js index.js index.css blogs-index.js

.PHONY: all index clean

# dist/: minified bundle + demo site. example/blogs/: posts using unbundled sources.
all: dist/zpw.min.js dist/zpw.min.css dist/index.html $(STATIC:%=dist/%) \
	$(SLUGS:%=dist/blogs/%.html) $(SLUGS:%=example/blogs/%.html)

dist/zpw.min.js: $(JS_SRC)
	@mkdir -p $(@D)
	cat $^ | $(ESBUILD) --minify --loader=js > $@

dist/zpw.min.css: $(CSS_SRC)
	@mkdir -p $(@D)
	cat $^ | $(ESBUILD) --minify --loader=css > $@

dist/index.html: build-artifact/bundle.html
	@mkdir -p $(@D)
	cp $< $@

$(STATIC:%=dist/%): dist/%: example/%
	@mkdir -p $(@D)
	cp $< $@

dist/blogs/%.html: example/posts/%.md build-artifact/post.html
	@mkdir -p $(@D)
	$(PANDOC) -V style=../zpw.min.css -V script=../zpw.min.js $< -o $@

example/blogs/%.html: example/posts/%.md build-artifact/post.html
	@mkdir -p $(@D)
	$(PANDOC) $(CSS_SRC:%=-V style=../../%) $(JS_SRC:%=-V script=../../%) $< -o $@

index: example/blogs-index.js

example/blogs-index.js: $(POSTS) build-artifact/entry.tpl Makefile
	@{ \
	  echo "["; sep=""; \
	  for f in $(POSTS); do \
	    slug=$$(basename $$f .md); \
	    printf '%s' "$$sep"; sep=","; \
	    pandoc --from markdown --to plain --standalone \
	      --template=build-artifact/entry.tpl \
	      --metadata slug=$$slug \
	      --metadata url=blogs/$$slug.html $$f; \
	  done; \
	  echo "]"; \
	} | python3 -c 'import json,sys; print("const BLOGS_INDEX = " + json.dumps(json.load(sys.stdin), indent=4, ensure_ascii=False) + ";")' > $@

clean:
	rm -rf dist example/blogs
