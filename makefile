build: node_modules
	node_modules/.bin/metalsmith

serve:
	node_modules/.bin/static build

node_modules: package.json
	npm install

clean:
	rm -rf node_modules
	rm -rf build

publish:
	git subtree push --prefix build --squash github gh-pages

publish-force:
	git subtree split --prefix build -b gh-pages
	git push -f github gh-pages:gh-pages
	git branch -D gh-pages

.PHONY: build
