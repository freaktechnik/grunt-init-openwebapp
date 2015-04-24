# {%= title %}

{%= description %}

## Getting Started
Install the dependencies with: `npm install && bower install`

You can create a web version of the app by just running `grunt build:web`, or a packaged
version using `grunt build:package`. For an unminifed web version use `grunt dev:web`.

The default grunt targets further include `grunt test`, `grunt launch:simulator` and `grunt launch:device`. Plus there are unfinished deployment tasks.

## Download
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) {%= grunt.template.today('yyyy') %} {%= author_name %}
Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.

