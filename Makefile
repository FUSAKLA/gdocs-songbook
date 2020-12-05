

.PHONY: deps
deps:
	npm install

.PHONY: lint
lint:
	npx gts lint

.PHONY: format
format:
	npx gts fix

.PHONY: push
push:
	clasp push

.PHONY: develop
develop:
	clasp push --watch --force

.PHONY: watch-logs
watch-logs:
	clasp logs --watch
