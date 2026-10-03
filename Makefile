.PHONY: all demo example clean

all: clean
	$(MAKE) -f bundle.js.mk all

demo: clean
	$(MAKE) -f demo.mk

example: clean
	$(MAKE) -f example.mk all

clean:
	$(MAKE) -f bundle.js.mk clean
	$(MAKE) -f demo.mk clean
	$(MAKE) -f example.mk clean
