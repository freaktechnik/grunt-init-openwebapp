# grunt-init-openwebapp

> Initialize a boilerplate webapp with [grunt-init][] with support for transifex, bower dependencies and basic validation.

[grunt-init]: http://gruntjs.com/project-scaffolding

## Installation
If you haven't already done so, install [grunt-init][].

Once grunt-init is installed, place this template in your `~/.grunt-init/`
directory. It's recommended that you use git to clone this template into that
directory, as follows:

```
git clone --depth 1 https://github.com/freaktechnik/grunt-init-openwebapp.git ~/.grunt-init/openwebapp
```

_(Windows users, see [the documentation][grunt-init] for the correct
destination directory path)_

## Usage

At the command-line, cd into an empty directory, run this command and follow
the prompts.

```
grunt-init openwebapp
```

_Note that this template will generate files in the current directory, so be
sure to change to a new directory first if you don't want to overwrite existing
files._

The generated content will be usable as-is, though be careful to set the transifex parameters correctly during the setup.
You can easily add-in other grunt tasks, like watch or ftp deployment, see [freaktechnik/mines.js][] as example.

### Resulting Structure

The Gruntfile coming with this template uses the following asset structure, relative to the project's root:

 type        | source                      | destination
-------------|-----------------------------|------------------------
HTML         | `assets/`                   | `dist/`
Images       | `assets/images/`            | `dist/images/`
Scripts      | `assets/scripts/*.js`       | `dist/scripts/*.min.js`
Stylesheets  | `assets/styles/*.css`       | `dist/styles/*.css`
Fonts        | `assets/fonts/`             | `dist/fonts/`
Bower        | The bower components folder | `dist/vendor/`
Transaltions | `locales/`                  | `dist/locales/`

These are easily adjustable within the first few lines of the Gruntfile.

### Special Functions

#### HTML
All HTML files in the html directory are preprocessed with the prerocess node module. The default files already contain directives that get prerocessed. The follwing variables are available (more can be added in the Gruntfile):

 name        | description
-------------|--------------------------------------------------------------------
`SCRIPT_DIR` | The javascript file destination folder.
`STYLE_DIR`  | The css file destination folder.
`FONT_DIR`   | The font destination folder.
`IMAGE_DIR`  | The image destination folder.
`LOCALE_DIR` | The translation file destination folder.
`HTML_DIR`   | The HTML file destination folder.
`VENDOR_DIR` | The bower components destination folder.
`LOCALES`    | A comma separated list of available languages.
`ICON_SIZES` | An array of available icon sizes.
`ICON_NAME`  | A function that returns the icon file name with the specified size.

#### Localization
The template initializes with an `app.properties` and an `manifest.json` file for the default language specified. The transifex resources are called "app" and "manifest" respectively.

#### File Headers
All minified, concatenated or uglified files get a default header containing the app name, author and licenses. It can be customized in a Gruntfile config property.

#### Bower Components
The Gruntfile is prepared with special rules for the gaia-fonts bower component. For all other components the files specified in the `main` property of the `bower.json` are copied.

#### Grunt Targets
Most grunt targets are documented in the `README.md` generated from this template.

[freaktechnik/mines.js]: https://github.com/freaktechnik/mines.js

