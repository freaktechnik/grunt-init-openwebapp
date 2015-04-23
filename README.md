# grunt-init-openwebapp

> Initialize a boilerplate webapp with [grunt-init][] with support for transifex, bower dependencies and basic validation.

[grunt-init]: http://gruntjs.com/project-scaffolding

## Installation
If you haven't already done so, install [grunt-init][].

Once grunt-init is installed, place this template in your `~/.grunt-init/`
directory. It's recommended that you use git to clone this template into that
directory, as follows:

```
git clone https://github.com/freaktechnik/grunt-init-openwebapp.git ~/.grunt-init/openwebapp
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

[freaktechnik/mines.js]: https://github.com/freaktechnik/mines.js

