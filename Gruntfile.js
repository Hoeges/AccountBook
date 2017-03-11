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
                    'Application/**/*.js'
                ],
                dest: 'release/app.js'
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

        copy: {
            // TODO
            css: {
                files: [
                    {
                        expand: true,
                        cwd: 'Application/Styles',
                        src: '*.*',
                        dest: 'release/'
                    }
                ]
            },

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
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', [
        'clean:pre_build',
        'jshint:jshint',
        'concat:js',
        'uglify:js',
        'htmlmin:html',
        'copy:css',
        'copy:favicon',
        'copy:service',
        'clean:post_build'
    ]);

};