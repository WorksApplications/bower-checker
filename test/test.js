var fs = require('fs');
var expect = require('expect.js');
var rimraf = require('rimraf');
var checker = require('../checker');

describe('checker', function() {
    var cwd = process.cwd();

    describe('install', function() {
        var projectDir, cleanDir;

        function clean(done) {
            rimraf(cleanDir, function(err) {
                if (err) throw new Error('Unable to remove components directory');
                done();
            });
        }

        afterEach(function(done) {
            process.chdir(cwd);
            clean(done);
        });

        it('Should install all denpendencies in empty project', function(done) {
            projectDir = cwd + '/test/assets/empty-project';
            cleanDir = projectDir + '/components';
            process.chdir(projectDir);

            checker.install(function() {
                expect(fs.existsSync('components/jquery')).to.be.ok();
                done();
            });
        });

        it('Should only install the missing components in partially projects', function() {
            projectDir = cwd + '/test/assets/installed-project';
            cleanDir = projectDir + '/components/zepto';
            process.chdir(projectDir);

            checker.install(function() {
                expect(fs.existsSync('components/jquery/jquery.js')).to.not.be.ok();
                expect(fs.existsSync('components/zepto')).to.be.ok();
                done();
            });
        });
    });
});
