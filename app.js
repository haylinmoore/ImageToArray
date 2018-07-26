// jshint esversion: 6
// jscs:disable maximumLineLength
const fs = require('fs');
let getter = require('pixel-getter');

if (process.argv[2] == undefined){
  throw "Needs a folder"
}

var path = process.argv[2];

var checker = null;
var filecount = null;
var outputbinary = [];

var processImage = function (file) {
  console.log(file)
  getter.get(path + file, (err, pixels) => {
    if (err) {
      throw err;
    }
    let output = [];
    for (let i = 0; i < pixels[0].length; i += 1) {

      var pixel = pixels[0][i];

      //console.log(rgbToBW(pixel))

      if (pixel.a == 0) {
        output.push(0);
      } else {
        output.push(1);
      }

    }

    outputbinary.push(output);
  });
}


fs.readdir(path, function (err, files) {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  filecount = 0;

  for (var i in files) {
    if (files[i].includes("png")) {
      filecount++;
      console.log("Processing: " + files[i]);
      processImage(files[i]);
    }
  }

  console.log("Total File Count Is " + filecount)


  checker = setInterval(function () {
    if (outputbinary.length == filecount) {
      console.log("Finished, output has been written to " + path + "output.json");
      fs.writeFileSync(path + "output.json", JSON.stringify(outputbinary), 'utf8');
      clearInterval(checker);
    }
  }, 1)


});