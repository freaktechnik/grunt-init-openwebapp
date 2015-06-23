/*
 * grunt-init-openwebapp
 *
 * Copyright (c) 2013 Martin Giger
 * Licensed under the GPL-3.0
 */

'use strict';

// Basic template description.
exports.description = 'Initialize a boilerplate webapp.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm ' +
  'install_. Make sure your transifex configuration is correct and add ' +
  'bower dependencies to the bower.json, then run _bower install_. '+
  'After that, you may execute project tasks with _grunt_. For ' +
  'more information about installing and configuring Grunt, please see ' +
  'the Getting Started guide:' +
  '\n\n' +
  'http://gruntjs.com/getting-started';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({}, [
    // Prompt for these values.
    init.prompt('name'),
    init.prompt('title'),
    init.prompt('description'),
    init.prompt('version'),
    init.prompt('repository'),
    init.prompt('bugs'),
    init.prompt('homepage'),
    init.prompt('licenses'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url'),
    init.prompt('main', '/index.html'),
    init.prompt('transifex_slug', function(value, data, done) {
        var name = data.name || '';
        done(null, name);
    }),
    init.prompt('default_locale', 'en')
  ], function(err, props) {
    props.keywords = [];
    props.devDependencies = {
        "grunt-accessibility": "~3.0.1",
        "grunt-appcache": "~0.1.8",
        "grunt-bower": "~0.18.0",
        "grunt-contrib-clean": "~0.6.0",
        "grunt-contrib-compress": "~0.13.0",
        "grunt-contrib-copy": "~0.8.0",
        "grunt-contrib-cssmin": "~0.12.2",
        "grunt-contrib-jshint": "~0.6.0",
        "grunt-contrib-uglify": "~0.2.0",
        "grunt-contrib-watch": "~0.6.1",
        "grunt-transifex": "~0.1.1",
        "grunt-validate-webapp": "~0.1.0",
        "grunt-webapp": "~0.3.0",
        "grunt-firefoxos": "~0.1.2",
        "grunt-marketplace": "~0.1.1",
        "fxos-deploy": "~0.3.2",
        "fxos-connect": "~0.3.0"
    };
    props.npm_test = 'grunt test';

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props, {
        noProcess: ['**/*.png', 'assets/scripts/*.js']
    });

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // Generate bower.json file.
    init.writePackageJSON('bower.json', props, function(pkg, props) {
        pkg.ignore = [
            "**/.*",
            "node_modules",
            "bower_components",
            "test",
            "tests",
            "dist"
        ];
        pkg.private = true;
        pkg.dependencies = {};
        delete pkg.devDependencies;
        delete pkg.title;
        delete pkg.scripts;

        if(pkg.licenses) {
            pkg.license = pkg.licenses;
            delete pkg.licenses;
        }

        if(pkg.bugs) {
            delete pkg.bugs;
        }

        return pkg;
    });

    // All done!
    done();
  });

};
