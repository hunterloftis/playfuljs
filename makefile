build: node_modules
	node_modules/.bin/metalsmith

node_modules: package.json
	npm install

clean:
	rm -rf node_modules
	rm -rf build

publish:
	git subtree push --prefix build github gh-pages

.PHONY: build
