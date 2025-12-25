'use strict';
const fs = require('fs');
const packageJSON = require('../package.json');
const upath = require('upath');
const sass = require('sass');
const sh = require('shelljs');

const stylesPath = '../src/scss/styles.scss';
const destPath = upath.resolve(upath.dirname(__filename), '../dist/css/styles.css');

module.exports = function renderSCSS() {
    
    const results = sass.compileString(entryPoint, {
        loadPaths: [
            upath.resolve(upath.dirname(__filename), '../node_modules')
        ],
    });

    const destPathDirname = upath.dirname(destPath);
    if (!sh.test('-e', destPathDirname)) {
        sh.mkdir('-p', destPathDirname);
    }

    fs.writeFileSync(destPath, results.css);

};

const entryPoint = `/*!
* Start Bootstrap - ${packageJSON.title} v${packageJSON.version} (${packageJSON.homepage})
* Copyright 2013-${new Date().getFullYear()} ${packageJSON.author}
* Licensed under ${packageJSON.license} (https://github.com/StartBootstrap/${packageJSON.name}/blob/master/LICENSE)
*/
@import "${stylesPath}"
`