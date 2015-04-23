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
            main: {
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

    // Default task(s).
    grunt.registerTask('default', ['web']);

    // Build the app for the web
    grunt.registerTask('web', ['transifex', 'uglify', 'bower', 'cssmin', 'copy:html', 'copy:build', 'webapp:web', 'appcache']);
    // Package the app
    grunt.registerTask('package', ['transifex', 'uglify', 'bower', 'cssmin', 'copy:html', 'copy:build', 'webapp:packaged', 'compress']);

    // Unminified web version
    grunt.registerTask('dev', ['jshint', 'bower', 'copy:dev', 'copy:html', 'copy:build', 'webapp:web', 'appcache']);

    grunt.registerTask('test', ['package', 'jshint', 'validatewebapp', 'accessibility']);
};
