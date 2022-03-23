ifndef REPORTER
	REPORTER=dot
endif
lib_dir=$(CURDIR)/lib
test_dir=$(CURDIR)/test
coverage_dir=$(CURDIR)/test/coverage

h help:
	@echo 'Usage: make [target]'
	@echo Targets:
	@echo ' cov, coverage		Build coverage report'
	@echo '      tags		Generate tag index file'
	@echo '   t, test		Run all tests'
	@echo '  tw, test-watch		Run all tests in watch mode'
.PHONY: h help

cov coverage:
	@rm -rf $(coverage_dir)
	@NODE_ENV=test $(CURDIR)/node_modules/.bin/nyc --report-dir $(coverage_dir) \
		node_modules/.bin/_mocha -- -R dot --recursive test
	./node_modules/.bin/nyc --report-dir $(coverage_dir) report --reporter=lcov
.PHONY: cov coverage

tags:
	cd .git && ctags -R -f tags ../lib
.PHONY: tags

t test:
	@rm -rf $(coverage_dir)
	@NODE_ENV=test $(CURDIR)/node_modules/.bin/mocha \
		--recursive $(test_dir) \
		--reporter $(REPORTER)
.PHONY: t test

vc view-coverage:
	open $(coverage_dir)/lcov-report/index.html
.PHONY: vc view-coverage

tw test-watch:
	@rm -rf $(coverage_dir)
	@NODE_ENV=test nodemon \
		--watch $(lib_dir) \
		--watch $(test_dir) \
		./node_modules/.bin/mocha \
		--recursive $(test_dir) \
		--reporter min
.PHONY: tw test-watch
