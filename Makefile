install:
	npm install

build:
	rm -rf dist
	NODE_ENV=production babel src --out-dir dist --source-maps inline

lint:
	npx eslint .

publish:
	npm publish

start:
	npx babel-node -- src/bin/gendiff.js --help

test:
	npm test