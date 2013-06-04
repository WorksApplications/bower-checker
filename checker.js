/**
 * main library, check libraries versions and then run `bower install`
 * this script is used to compare javascript libraries versions
 * installed by bower, and run `bower install` only when necessary
 */

var fs = require('fs');
var path = require('path');
var bower = require('bower');
var _ = require('lodash');

/** compare the version in `component.json` and real version
 * `components/` directory.
 * return true only if they are the same
 */
function checkVersion(name, version) {
    var match = false,
    existVer = '',
    dir = process.cwd() + '/components/' + name + '/';

    if (fs.existsSync(dir + 'component.json')) {

        existVer = require(dir + 'component.json').version;

    } else if (fs.existsSync(dir + 'bower.json')) {

        existVer = require(dir + 'bower.json').version;

    }

    if (version === existVer ) {
        match = true;
    }

    return match;
}

function filterPaths(paths) {
    var name,
    version,
    newPaths = {},
    hashIndex; //index of the '#' in version string, like `jquery#1.9.3`

    //if components directory does not exist, we need to run bower install
    if (!fs.existsSync('./components') ||
        !fs.statSync('./components').isDirectory()) {
        console.log('no bower library directory, install all');
        return paths;
    }

    for (name in paths) {
        version = paths[name];
        hashIndex = version.lastIndexOf('#');

        if (hashIndex !== -1) {
            version = version.substring(hashIndex + 1);
        }

        //install the library only if the version does not match
        if (!checkVersion(name, version)) {
            console.log('bower keep %s#%s', name, version);
            newPaths[name] = paths[name];
        } else {
            console.log('bower skip %s#%s', name, version);
        }
    }

    return newPaths;
}

function getEndpointsFromPaths(paths) {
    var endpoints = [],
    name, version;

    for (name in paths) {
        version = paths[name];

        if (version.indexOf('#') !== -1) {
            endpoints.push(version);
        } else {
            endpoints.push(name + '#' + version);
        }
    }

    return endpoints;
}

function getComponents() {
    var cwd = process.cwd(),
    components = {}
    jsonPath = path.join(cwd, 'bower.json'),
    fallback = path.join(cwd, 'component.json');

    if (fs.existsSync(jsonPath)) {
        components = require(jsonPath);
    } else if (fs.existsSync(fallback)) {
        console.warn('Fallback to \'component.json\', try to use the new \'bower.json\'');
        components = require(fallback);
    } else {
        console.warn('No bower configuration file found!');
    }

    return components;
}

module.exports.install = function(callback) {
    var components = getComponents(),
    paths = _.extend({}, components.dependencies, components.devDependencies),
    endpoints;

    paths = filterPaths(paths);

    if (!_.isEmpty(paths)) {

        //see bower's api implementation of 'lib/core/manager.js'
        endpoints = getEndpointsFromPaths(paths);

        bower.commands.install(endpoints)
            .on('data', function(data) {
                if (data) {
                    process.stdout.write(data);
                }
            })
            .on('package', function(data) {
                if (data) {
                    process.stdout.write(data);
                }
            })
            .on('warn', function(data) {
                if (data) {
                    process.stdout.write(data + '\n');
                }
            })
            .on('end', function(data) {
                if (data) {
                    process.stdout.write(data);
                }

                if (callback) {
                    callback();
                }
            })
            .on('error', function(err) {
                if (err) {
                    throw err;
                }
                process.exit(1);
            });
    } else {
        if (callback) {
            callback();
        }
    }
}
