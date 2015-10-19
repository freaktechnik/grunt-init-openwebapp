module.exports = function(grunt) {
    var bowerDevDeps = Object.keys(grunt.file.readJSON('bower.json').devDependencies);
    // If your bower dev deps have dependencies, you might want to add them to the bowerDevDeps array here.

    // Project configuration.
    grunt.initConfig({
        // The name pattern of the images that should be considered icons. The * should be the size of the icon. Note that the head.html preprocessing file doesn't use this pattern for naming.
        iconFile: 'icon-*.png',
        distdir: 'dist',
        // Subfolders of the distdir where stuff gets placed
        dist: {
            html: '/',
            image: '/images/',
            locale: '/locales/',
            script: '/scripts/',
            bower: '/vendor/',
            style: '/styles/',
            font: '/fonts/',
            icon: '<%= dist.image %><%= iconFile %>'
        },
        // Asset directory locations
        assetdir: 'assets',
        src: {
            //!!! If you move any of these directories out of assetdir (With the exception of locales) watch will break, so adjust it, too!
            html: '<%= assetdir %>',
            script: '<%= assetdir %>/scripts',
            style: '<%= assetdir %>/styles',
            image: '<%= assetdir %>/images',
            font: '<%= assetdir %>/fonts',
            locale: 'locales',
            icon: '<%= src.image %>/<%= iconFile %>',
            include: '<%= assetdir %>/include'
        },
        pkg: grunt.file.readJSON('package.json'),
        banner:
            '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name || pkg.author %>;\n' +
            ' * Licensed under the <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
        // These JS statements are expanded after the config was set, so the used config values are defined.
        locales: '<%= grunt.file.expand({cwd:grunt.config("src.locale")}, "*").join(",") %>',
        // This lists the sizes of the icon files for the head preprocessing.
        iconSizes: '<%= JSON.stringify(grunt.file.expand({cwd: grunt.config("src.image")}, grunt.config("iconFile")).map(function(fn) {return fn.match(new RegExp(grunt.config("iconFile").replace("*", "([0-9]+)")))[1];})) %>',
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= src.script %>',
                        src: '**/*.js',
                        dest: '<%= distdir %><%= dist.script %>',
                        ext: '.min.js'
                    }
                ]
            }
        },
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= src.style %>',
                    src: ['*.css'],
                    dest: '<%= distdir %><%= dist.style %>',
                    ext: '.css'
                }]
            }
        },
        jshint: {
            test: {
                files: {
                    src: ['Gruntfile.js', '<%= src.script %>/**/*.js', 'test/**/*.js']
                }
            }
        },
        bower: {
            build: {
                dest: '<%= distdir %><%= dist.bower %>',
                options: {
                    expand: true,
                    ignorePackages: bowerDevDeps,
                    packageSpecific: {
                        'fira': {
                            files: [
                                'eot/FiraSans-*',
                                'eot/FiraMono-*',
                                'woff/FiraSans-*',
                                'woff/FiraMono-*',
                                'ttf/*',
                                'fira.css'
                            ]
                        },
                        'gaia-fonts': {
                            files: [
                                'fonts/**',
                                'style.css'
                            ]
                        }
                    }
                }
            }
        },
        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= src.script %>',
                        src: '**/*.js',
                        dest: '<%= distdir %><%= dist.script %>',
                        ext: '.min.js'
                    },
                    {
                        expand: true,
                        cwd: '<%= src.style %>',
                        src: ['*.css'],
                        dest: '<%= distdir %><%= dist.style %>',
                        ext: '.css'
                    }
                ]
            },
            build: {
               files: [
                    {
                        expand: true,
                        cwd: '<%= src.locale %>',
                        src: ['*/app.properties'],
                        dest: '<%= distdir %><%= dist.locale %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= src.font %>',
                        src: ['**'],
                        dest: '<%= distdir %><%= dist.font %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= src.image %>',
                        src: ['**/*.png', '**/*.svg', '**/*.jpg', '**/*.gif'],
                        dest: '<%= distdir %><%= dist.image %>'
                    },
                    {
                        expand: true,
                        cwd: '.',
                        src: ['*LICENSE*'],
                        dest: '<%= distdir %>'
                    }
                ]
            }
        },
        transifex: {
            build_properties: {
                options: {
                    targetDir: '<%= src.locale %>',
                    project: '{%= transifex_slug %}',
                    resources: ['app'],
                    filename: '_lang_/_resource_.properties',
                    templateFn: function(strings) {
                        // Parse the transifex API response to a .properties file
                        return strings.sort(function(a, b) {
                            return a.key.localeCompare(b.key);
                        }).reduce(function(p, string) {
                            return p + string.key + "=" + string.translation + "\n";
                        }, "");
                    }
                }
            },
            build_json: {
                options: {
                    targetDir: '<%= src.locale %>',
                    resources: ['manifest'],
                    filename: '_lang_/_resource_.json',
                    project: '{%= transifex_slug %}',
                    mode: "file"
                }
            }
        },
        clean: {
            main: [ '<%= distdir %>', '*.zip' ]
        },
        compress: {
            build: {
                options: {
                    archive: '<%= pkg.name %>-<%= pkg.version %>.zip'
                },
                expand: true,
                cwd: '<%= distdir %>/',
                src: ['**/*'],
                dest: '/'
            }
        },
        validatewebapp: {
            options: {
                listed: true,
                packaged: true
            },
            main: { src: '<%= distdir %>/manifest.webapp' }
        },
        accessibility: {
            options: {
                reportLevels: {
                    notice: false,
                    warning: true,
                    error: true
                },
                /* ignore: [
                    id of the rule as string (WCAG2A.Principle1. etc.)
                ], */
                force: false
            },
            main: {
                expand: true,
                cwd: '<%= distdir %><%= dist.html %>',
                src: '*.html'
            }
        },
        appcache: {
            options: {
                basePath: '<%= distdir %>'
            },
            web: {
                dest: '<%= distdir %>/manifest.appcache',
                cache: '<%= distdir %>/**/*'
            }
        },
        webapp: {
            options: {
                localeDir: '<%= src.locale %>',
                icons: '<%= src.icon %>',
                iconsTarget: '<%= grunt.config("dist.icon").replace("*", "{size}") %>'
            },
            web: {
                options: {
                    target: 'web'
                },
                files: [{ '<%= distdir %>/manifest.webapp': 'manifest.webapp' }]
            },
            packaged: {
                options: {
                    target: 'packaged'
                },
                files: [{ '<%= distdir %>/manifest.webapp': 'manifest.webapp' }]
            }
        },
        ffospush: {
            launch: {
                appId: '<%= pkg.name %>',
                zip: '<%= pkg.name %>-<%= pkg.version %>.zip'
            }
        },
        watch: {
            options: {
                interrupt: true,
                atBegin: true
            },
            web: {
                options: {
                    //livereload: true
                },
                files: ['<%= assetdir %>/**/*', 'manifest.webapp', '<%= src.locale %>/{%= default_locale %}/*'],
                tasks: 'dev'
            },
            packaged: {
                files: ['<%= assetdir %>/**/*', 'manifest.webapp', '<%= src.locale %>/{%= default_locale %}/*'],
                tasks: 'launch:simulator'
            }
        },
        marketplace: {
            options: {
                consumerKey: '', //TODO
                consumerSecret: '' //TODO
            },
            packaged: {
                options: {
                    target: "packaged"
                },
                files: ['<%= pkg.name %>-<%= pkg.version %>.zip']
            },
            web: {
                options: {
                    target: "manifest"
                },
                files: ['<%= distdir %>/manifest.webapp']
            }
        },
        preprocess: {
            options: {
                srcDir: '<%= src.include %>',
                context: {
                    SCRIPT_DIR: '<%= dist.script %>',
                    STYLE_DIR: '<%= dist.style %>',
                    FONT_DIR: '<%= dist.font %>',
                    IMAGE_DIR: '<%= dist.image %>',
                    LOCALE_DIR: '<%= dist.locale %>',
                    HTML_DIR: '<%= dist.html %>',
                    VENDOR_DIR: '<%= dist.bower %>',
                    LOCALES: '<%= locales %>',
                    ICON_SIZES: '<%= iconSizes %>',
                    ICON_NAME: function(size) {
                        return grunt.config('dist.icon').replace('*', size);
                    }
                }
            },
            html: {
                expand: true,
                cwd: '<%= src.html %>',
                src: ['*.html'],
                dest: '<%= distdir %><%= dist.html %>'
            }
        },
        htmllint: {
            test: {
                options: {
                    ignore: [
                        /Bad value “localization” for attribute “rel” on element “link”/,
                        'Bad value ”<%= dist.locale %>{locale}/app.properties” for attribute “href” on element “link”: Illegal character in path segment: not a URL code point.',
                    ]
                },
                files: {
                    src: [ '<%= distdir %><%= dist.html %>*.html' ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-transifex');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-validate-webapp');
    grunt.loadNpmTasks('grunt-accessibility');
    grunt.loadNpmTasks('grunt-appcache');
    grunt.loadNpmTasks('grunt-webapp');
    grunt.loadNpmTasks('grunt-firefoxos');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-marketplace');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-html');

    // Default task(s).
    grunt.registerTask('default', ['build:web']);

    grunt.registerTask('build', 'Build the webapp for the web or as a package (use :web or :packaged)', function(env) {
        env = env || 'web';
        grunt.task.run('transifex');

        grunt.task.run('uglify');
        grunt.task.run('bower');
        grunt.task.run('cssmin');
        grunt.task.run('preprocess:html');
        grunt.task.run('copy:build');
        grunt.task.run('webapp:'+env);

        if(env == 'packaged') {
            grunt.task.run('compress:build');
        }
        else {
            grunt.task.run('appcache');
        }
    });

    grunt.registerTask('dev', 'Build an unminified version of the app (use :web or :packaged)', function(env) {
        env = env || 'web';

        grunt.task.run('bower');
        grunt.task.run('copy:dev');
        grunt.task.run('preprocess:html');
        grunt.task.run('copy:build');
        grunt.task.run('webapp:'+env);
        if(env == 'packaged') {
            grunt.task.run('compress:build');
        }
        else {
            grunt.task.run('appcache');
        }
    });

    grunt.registerTask('test', 'Run tests and validations', ['webapp:packaged', 'copy:build', 'jshint', 'validatewebapp', 'preprocess:html', 'htmllint', 'accessibility', 'clean']);

    grunt.registerTask('deploy', 'Deoply the app, targets are :web or :packaged', function(env) {
        env = env || 'web';

        grunt.task.run('build:'+env);

        if(env == 'packaged') {
            grunt.task.run('marketplace');
        }
        else {
            grunt.fail.warn("No actual deployment strategy for web defined");
            // example:
            // grunt.task.run('ftp-deploy:production');
            // grunt.task.run('marketplace:web');
        }
    });

    grunt.registerTask('stage', 'Publish the app to staging with unminified sources (only :web for now)', function(env) {
        env = env || 'web';

        grunt.task.run('transifex');
        grunt.task.run('dev:'+env);

        if(env == 'web') {
            grunt.fail.warn("No actual deployment strategy for web defined");
            // example:
            // grunt.task.run('ftp-deploy:stage');
        }
        else {
            grunt.fail.warn("Can't deploy anywhere else than web.");
        }
    });

    grunt.registerTask('simulator', function(version) {
        var done = this.async();
        var opts = {
            connect: true
        };

        if(version != "undefined") {
            opts.release = [version];
        }

        connectSim(opts).then(function(sim) {
            return deploySim({
                manifestURL: 'dist/manifest.webapp',
                zip: grunt.config('pkg.name')+"-"+grunt.config('pkg.version')+".zip",
                client: sim.client
            }).then(function(appId) {
                grunt.log.ok("Started simulator with app "+appId);
                sim.client.addEventListener("end", done);
            }, function(err) {
                grunt.fail.warn(err);
                done(false);
            });
        }, function(err) {
            grunt.fail.warn(err);
            done(false);
        });
    });

    grunt.registerTask('open', function(target, version) {
        grunt.task.requires('dev:packaged');

        if(target == 'device') {
            grunt.task.run('ffospush');
        }
        else {
            if((!version || version == "undefined") && target != 'simulator')
                version = target;

            grunt.task.run('simulator:'+version);
        }
    });

    grunt.registerTask('launch', 'Launch a test version of the app on a FxOS Device or Simulator (use :device or :simulator)', function(target, version) {
        target = target || 'simulator';

        grunt.task.run('dev:packaged');

        grunt.task.run('open:'+target+":"+version);
    });
};
