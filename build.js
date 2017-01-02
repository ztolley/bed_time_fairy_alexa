'use strict';

var fs = require('fs');
var archiver = require('archiver');
var output = fs.createWriteStream(__dirname + '/bedtimelambda.zip');
var archive = archiver('zip');

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

archive.directory('src/data', true, { date: new Date() });
archive.directory('src/intents', true, { date: new Date() });
archive.directory('node_modules', true, { date: new Date() });
archive.directory('src/lib', true, { date: new Date() });
archive.file('index.js', { date: new Date() });
archive.file('package.json', { date: new Date() });


archive.finalize();
