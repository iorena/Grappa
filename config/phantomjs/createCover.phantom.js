var page = require('webpage').create();
page.paperSize = {
  height: '11in',
  width: '8.5in',
};

page.onResourceError = function(resourceError) {
    console.error(resourceError.url + ': ' + resourceError.errorString);
};

var args = require('system').args;

var i = 1;
var pathToFolder = args[1];
var pathToFile = "file:///" + pathToFolder + "/" + i + '.html';
var pathToOutput = pathToFolder + "/" + i + '.pdf';
page.open(pathToFile, function(status) {
  console.log("status", status)
  page.render(pathToOutput);
  phantom.exit();
})

// var args = require('system').args;
// console.log("hehe")
// if (args[1] && args[2]) {
//   var pathToFolder = args[1];
//   var amount = parseInt(args[2]);
//   for(var i = 1; i <= amount; i++) {
//     console.log("LOOPING")
//     // console.log(pathToFolder + "/" + i + ".html")
//     setTimeout(function () {
//       var pathToFile = pathToFolder + "/" + i + '.html';
//       var pathToOutput = pathToFolder + "/" + i + '.pdf';
//       page.open(pathToFile, function() {
//         page.render(pathToOutput);
//         if (i === amount) phantom.exit()
//       });
//     }, 100 * (i - 1));
//   }
// }
