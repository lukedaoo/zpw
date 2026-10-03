.PHONY: all demo example release clean

all: clean
	$(MAKE) -f bundle.js.mk all

demo: clean
	$(MAKE) -f demo.mk

example: clean
	$(MAKE) -f example.mk all

RELEASE_OUT := dist-release

release:
	rm -rf $(RELEASE_OUT)
	$(MAKE) -f bundle.js.mk modules OUT=$(RELEASE_OUT)
	find $(RELEASE_OUT) -type f ! -name '*-v*' -delete

clean:
	rm -rf $(RELEASE_OUT)
	$(MAKE) -f bundle.js.mk clean
	$(MAKE) -f demo.mk clean
	$(MAKE) -f example.mk clean
