var page = require("webpage").create();
page.paperSize = {
  height: "11in",
  width: "8.5in",
};

page.onResourceError = function(resourceError) {
  console.error(resourceError.url + ": " + resourceError.errorString);
};

var args = require("system").args;

if (args[1] && args[2]) {
  var pathToFolder = args[1];
  var amount = parseInt(args[2]);
  console.log(amount)
  for(var i = 1; i <= amount; i++) {
    // console.log("jees")
    var pathToFile = "file:///" + pathToFolder + "/0-" + i + ".cover.html";
    var pathToOutput = pathToFolder + "/0-" + i + ".cover.pdf";

    setTimeout(function () {
      page.open(pathToFile, function(status) {
        // console.log("status", status)
        page.render(pathToOutput);
      })
    }, 100 * (i - 1));

    setTimeout(function () {
      phantom.exit();
    }, 100 * amount);
  }
} else {
  phantom.exit();
}
// var args = require("system").args;
//
// if (args[1] && args[2]) {
//   var pathToFolder = args[1];
//   var amount = parseInt(args[2]);
//   for(var i = 1; i <= amount; i++) {
//     console.log("LOOPING")
//     setTimeout(function () {
//       var pathToFile = "file:///" + pathToFolder + "/" + i + ".html";
//       var pathToOutput = pathToFolder + "/" + i + ".pdf";
//       page.open(pathToFile, function() {
//         page.render(pathToOutput);
//         if (i === amount) phantom.exit()
//       });
//     }, 100 * (i - 1));
//   }
// }
