.PHONY: all demo example clean

all:
	$(MAKE) -f bundle.js.mk all

demo:
	$(MAKE) -f demo.mk

example:
	$(MAKE) -f example.mk all

clean:
	$(MAKE) -f bundle.js.mk clean
	$(MAKE) -f demo.mk clean
	$(MAKE) -f example.mk clean
