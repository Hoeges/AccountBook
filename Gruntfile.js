'use strict';

module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            jshint: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: [
                    'Gruntfile.js',
                    'Application/**/*.js',
                    'WebService/**/*.js'
                ]
            }
        },

        concat: {
            js: {
                options: {
                    sourceMap: true
                },
                src: [
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/lodash/lodash.js',
                    'node_modules/moment/moment.js',
                    'node_modules/moment/locale/de-at.js',
                    'node_modules/angular/angular.js',
                    'node_modules/angular-messages/angular-messages.js',
                    'node_modules/angular-route/angular-route.js',
                    'node_modules/angular-sanitize/angular-sanitize.js',
                    'node_modules/angular-aria/angular-aria.js',
                    'node_modules/angular-animate/angular-animate.js',
                    'node_modules/angular-i18n/angular-locale_de-at.js',
                    'node_modules/angular-material/angular-material.js',
                    'node_modules/angular-material-icons/angular-material-icons.js',
                    'node_modules/angular-translate/dist/angular-translate.js',
                    'node_modules/md-data-table/dist/md-data-table-templates.js',
                    'node_modules/md-data-table/dist/md-data-table.js',
                    'Application/**/*.js'
                ],
                dest: 'release/app.js'
            },
            css: {
                src: [
                    'node_modules/angular-material/angular-material.css',
                    'node_modules/angular-material-icons/angular-material-icons.css',
                    'node_modules/md-data-table/dist/md-data-table-style.css',
                    'Application/**/*.css'
                ],
                dest: 'release/app.css'
            }
        },

        uglify: {
            js: {
                options: {
                    preserveComments: false,
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: 'release/app.js.map'
                },
                files: {
                    'release/app.min.js': 'release/app.js'
                }
            }
        },

        cssmin: {
            css: {
                files: [{
                    expand: true,
                    cwd: 'release',
                    src: ['*.css', '!*.min.css'],
                    dest: 'release',
                    ext: '.min.css'
                }]
            }
        },

        copy: {
            favicon: {
                files: [
                    {
                        expand: true,
                        cwd: 'Application',
                        src: 'favicon.ico',
                        dest: 'release/'
                    }
                ]
            },
            service: {
                files: [
                    {
                        expand: true,
                        cwd: 'WebService',
                        src: '*.*',
                        dest: 'release/service/'
                    }
                ]
            }
        },

        htmlmin: {
            html: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    // Views
                    'release/index.html': 'Application/index.html',
                    'release/layout/add.html': 'Application/Views/add.html',
                    'release/layout/edit.html': 'Application/Views/edit.html',
                    'release/layout/list.html': 'Application/Views/list.html',
                    'release/layout/stat.html': 'Application/Views/stat.html',
                    // Components
                    'release/layout/loadingIndicator.html': 'Application/Components/LoadingIndicator/loadingIndicator.html'
                }
            }
        },

        clean: {
            pre_build: {
                options: {
                    force: true
                },
                src: [
                    'release/*'
                ]
            },
            post_build: {
                options: {
                    force: true
                },
                src: [
                    'release/app.js',
                    'release/app.js.map'
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', [
        'clean:pre_build',
        'jshint:jshint',
        'concat:js',
        'concat:css',
        'uglify:js',
        'cssmin:css',
        'htmlmin:html',
        'copy:favicon',
        'copy:service',
        'clean:post_build'
    ]);

};