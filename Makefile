.PHONY: all example clean

all:
	$(MAKE) -f bundle.js.mk all

example:
	$(MAKE) -f example.mk all

clean:
	$(MAKE) -f bundle.js.mk clean
	$(MAKE) -f example.mk clean
