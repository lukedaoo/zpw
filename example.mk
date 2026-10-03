# Example site, served from source (npx live-server, open /example/).
# Posts use unbundled sources. Usage: make -f example.mk [index]
include modules.mk

POSTS := $(wildcard example/posts/*.md)
SLUGS := $(basename $(notdir $(POSTS)))

.PHONY: all index clean

all: $(SLUGS:%=example/blogs/%.html)

# Posts sit at example/blogs/, two levels below the repo root.
example/blogs/%.html: example/posts/%.md build-artifact/post.html
	@mkdir -p $(@D)
	$(PANDOC) $(blogs_CSS:%=-V style=../../%) $(blogs_JS:%=-V script=../../%) $< -o $@

index: example/blogs-index.js

example/blogs-index.js: $(POSTS) build-artifact/entry.tpl example.mk
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
	rm -rf example/blogs
