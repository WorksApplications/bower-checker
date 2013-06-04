About
=======

[bower](http://bower.io/) is slow, but if we use the dependencies with exact version,
we can skip the `git clone` network traffic by checking versions before running `bower install`.
This is what `bower-checker` does.

[![Build Status](https://travis-ci.org/WorksApplications/bower-checker.png)](https://travis-ci.org/WorksApplications/bower-checker)

How to use
=======

### bower config

Before using this library, you need to make sure all your bower components decleared in `bower.json` or `component.json` needs to use exactly specified version string, like:

```json
{
  "dependencies": {
    "bootstrap": "2.3.1",
    "html5shiv": "3.6.2",
    "jquery": "1.9.1"
  },
  "devDependencies": {
    "requirejs": "2.1.5",
    "almond": "0.2.1"
  }
}
```

range options in [semver](https://github.com/isaacs/node-semver) like `~2.1.1`, `>1.0.0` is not supported by this library.

### use in node
Now if your `bower.json` is good, then just add `bower-checker` in your package's dependencies:

```json
"devDependencies": {
  "bower-checker": "0.0.1",
}
```

then just call the `install` function to install you project's bower components:

```javascript
var checker = require('bower-checker');

checker.install(function() {
    done();
});
```

It will only install the libraries which have a miss matched version than declared in `bower.json`, which means it won't fetch the git repository util you change the library version.

### grunt task
If you want to use this library in your grunt task, it is easy, just add this in your `Gruntfile.js`:

```javascript
    grunt.registerTask('bower', 'install external libraries by using bower', function() {
        var done = this.async();

        require('bower-checker').install(done);
    });
```

Issues
=======
This repo is only for development, if you meet problems, please fire issues at:

https://github.com/WorksApplications/bower-checker/issues
