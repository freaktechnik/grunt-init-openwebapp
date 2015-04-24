module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        distdir: 'dist',
        localedir: 'locales',
        pkg: grunt.file.readJSON('package.json'),
        banner:
            '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
            ' * Licensed under the <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
        locales: function() {
            return grunt.file.expand(grunt.config('localedir')+"/*").join(",").replace(new RegExp(grunt.config('localedir')+"/", "g"), "");
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'assets/scripts',
                        src: '**/*.js',
                        dest: '<%= distdir %>/scripts',
                        ext: '.min.js'
                    }
                ]
            }
        },
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'assets/styles',
                    src: ['*.css'],
                    dest: '<%= distdir %>/styles/',
                    ext: '.css'
                }]
            }
        },
        jshint: {
            test: {
                files: {
                    src: ['Gruntfile.js', 'assets/scripts/**/*.js', 'test/**/*.js']
                }
            }
        },
        bower: {
            build: {
                dest: '<%= distdir %>/vendor/',
                options: {
                    expand: true,
                    packageSpecific: {
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
                        cwd: 'assets/scripts',
                        src: '**/*.js',
                        dest: '<%= distdir %>/scripts',
                        ext: '.min.js'
                    },
                    {
                        expand: true,
                        cwd: 'assets/styles',
                        src: ['*.css'],
                        dest: '<%= distdir %>/styles',
                        ext: '.css'
                    }
                ]
            },
            html: {
                options: {
                    process: function(file) {
                        return file.replace("{{locales}}", grunt.config('locales'));
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: 'assets',
                        src: ['*.html'],
                        dest: '<%= distdir %>'
                    }
                ]
            },
            build: {
               files: [
                    {
                        expand: true,
                        cwd: '<%= localedir %>',
                        src: ['**'],
                        dest: '<%= distdir %>/<%= localedir %>'
                    },
                    {
                        expand: true,
                        cwd: 'assets/fonts',
                        src: ['**'],
                        dest: '<%= distdir %>/fonts'
                    },
                    {
                        expand: true,
                        cwd: 'assets/images',
                        src: ['**/*.png', '**/*.svg', '**/*.jpg', '**/*.gif'],
                        dest: '<%= distdir %>/images'
                    }
                ]
            }
        },
        transifex: {
            build_properties: {
                options: {
                    targetDir: '<%= localedir %>',
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
                    targetDir: '<%= localedir %>',
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
                force: false
            },
            main: {
                src: 'assets/*.html'
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
                localeDir: '<%= localedir %>',
                icons: 'assets/images/icon-*.png',
                iconsTarget: 'images/icon-{size}.png'
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
                files: ['assets/**/*', 'manifest.webapp', 'locales/{%= default_locale %}/*'],
                tasks: 'dev'
            },
            packaged: {
                files: ['assets/**/*', 'manifest.webapp', 'locales/{%= default_locale %}/*'],
                tasks: 'launch:simulator'
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

    // Default task(s).
    grunt.registerTask('default', ['build:web']);

    grunt.registerTask('build', 'Build the webapp for the web or as a package (use :web or :packaged)', function(env) {
        env = env || 'web';
        grunt.task.run('transifex');

        grunt.task.run('uglify');
        grunt.task.run('bower');
        grunt.task.run('cssmin');
        grunt.task.run('copy:html');
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
        grunt.task.run('copy:html');
        grunt.task.run('copy:build');
        grunt.task.run('webapp:'+env);
        if(env == 'packaged') {
            grunt.task.run('compress:build');
        }
        else {
            grunt.task.run('appcache');
        }
    });

    grunt.registerTask('test', 'Run tests and validations', ['webapp:packaged', 'copy:build', 'jshint', 'validatewebapp', 'accessibility', 'clean']);

    grunt.registerTask('deploy', 'Deoply the app, targets are :web or :packaged', function(env) {
        env = env || 'web';
        if(env == 'packaged') {
            grunt.fail.warn("Can't deploy packaged apps yet.");
        }
        else {
            grunt.task.run('build:web');
            grunt.fail.warn("No actual deployment strategy for web defined");
            // example:
            // grunt.task.run('ftp-deploy:production');
        }
    });

    grunt.registerTask('stage', 'Publish the app to staging with unminified sources (only :web for now)', function(env) {
        env = env || 'web';
        if(env == 'web') {
            grunt.task.run('dev:web');
            grunt.fail.warn("No actual deployment strategy for web defined");
            // example:
            // grunt.task.run('ftp-deploy:stage');
        }
        else {
            grunt.fail.warn("Can't deploy anywhere else than web.");
        }
    });

    grunt.registerTask('simulator', function() {
        var done = this.async();
        connectSim({connect: true}).then(function(sim) {
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

    grunt.registerTask('open', function(target) {
        grunt.task.requires('dev:packaged');

        if(target == 'device') {
            grunt.task.run('ffospush');
        }
        else {
            grunt.util.spawn({
                grunt: true,
                opts: {
                    stdio: 'inherit'
                },
                args: ['simulator']
            }, function(err) {
                if(err) {
                    grunt.fail.warn(err);
                }
            });
        }
    });

    grunt.registerTask('launch', 'Launch a test version of the app on a FxOS Device or Simulator (use :device or :simulator)', function(target) {
        target = target || 'simulator';

        grunt.task.run('dev:packaged');

        grunt.task.run('open:'+target);
    });
};
