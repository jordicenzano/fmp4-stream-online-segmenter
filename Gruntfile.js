module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            dist: {
                options: {
                    transform: [
                        ["babelify"]
                    ]
                },
                files: {
                    // if the source file has an extension of es6 then
                    // we change the name of the source file accordingly.
                    // The result file's extension is always .js
                    "./docs/js/dashManifestGeneratorBrowser.js": ["./src/dashManifestGeneratorBrowser.js"]
                }
            }
        },
        'string-replace': {
            dist: {
                files: {
                    './docs/js/dashManifestGeneratorBrowser.js': './docs/js/dashManifestGeneratorBrowser.js'
                },
                options: {
                    replacements: [{
                        pattern: 'if (!Buffer.isBuffer(buffer)) {',
                        replacement: 'if (false) {'
                    }]
                }
            }
        },
        watch: {
            scripts: {
                files: ["./src/*.js"],
                tasks: ["browserify", "fixbinaryparser"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("build", ["browserify", "string-replace"]);
    grunt.registerTask("default", ["watch"]);
};
