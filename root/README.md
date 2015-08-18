# {%= title %}

{%= description %}

## Build

### Install Build Tools
You'll have to install these tools in order to build the app.

* [npm](https://www.npmjs.com/) (available as package for most Linux distros)
* [Bower](http://bower.io/) (installed by running `npm install -g bower` in the command line)
* [Grunt](http://gruntjs.com/) (installed by running `npm install -g grunt-cli` in the command line)

### Install Dependencies
Install the dependencies with: `npm install && bower install`

### Build the App
You can create a web version of the app by just running `grunt build:web`, or a packaged
version using `grunt build:package`. For an unminifed web version use `grunt dev:web`.

The default grunt targets further include `grunt test`, `grunt watch`, `grunt launch:simulator` and `grunt launch:device`. Plus there are unfinished deployment tasks.

## Download
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) {%= grunt.template.today('yyyy') %} {%= author_name %}
Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.

