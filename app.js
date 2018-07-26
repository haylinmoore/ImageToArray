// jshint esversion: 6
// jscs:disable maximumLineLength
const fs = require('fs');

const getter = require('pixel-getter');

if (process.argv[2] == undefined) {
  throw "Needs a folder"
}

const path = process.argv[2];

let checker = null;
let filecount = null;
const outputbinary = [];

const processImage = file => {
  console.log(file)
  getter.get(path + file, (err, pixels) => {
    if (err) {
      throw err;
    }
    let output = [];

    for (const pixel of pixels[0]) {
      //console.log(rgbToBW(pixel))

      if (pixel.a == 0) {
        output.push(0);
      } else {
        output.push(1);
      }
    }

    outputbinary.push(output);
  });
};


fs.readdir(path, (err, files) => {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  filecount = 0;

  for (const i in files) {
    if (files[i].includes("png")) {
      filecount++;
      console.log(`Processing: ${files[i]}`);
      processImage(files[i]);
    }
  }

  console.log(`Total File Count Is ${filecount}`)


  checker = setInterval(() => {
    if (outputbinary.length == filecount) {
      console.log(`Finished, output has been written to ${path}output.json`);
      fs.writeFileSync(`${path}output.json`, JSON.stringify(outputbinary), 'utf8');
      clearInterval(checker);
    }
  }, 1)


});