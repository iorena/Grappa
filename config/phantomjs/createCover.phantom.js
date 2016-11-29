var page = require("webpage").create();
page.paperSize = {
  height: "11in",
  width: "8.5in",
};

page.onResourceError = function(resourceError) {
  console.error(resourceError.url + ": " + resourceError.errorString);
};

var renderAndWait = function(toFile, toOutput, timeout) {
  setTimeout(function () {
    page.open(toFile, function(status) {
      // console.log("path", toOutput);
      // console.log("status", status)
      page.render(toOutput);
    })
  }, timeout);
}

var args = require("system").args;

if (args[1] && args[2]) {
  var pathToFolder = args[1];
  var amount = parseInt(args[2]);
  for(var i = 1; i <= amount; i++) {
    var pathToFile = "file:///" + pathToFolder + "/0-" + i + ".cover.html";
    var pathToOutput = pathToFolder + "/0-" + i + ".cover.pdf";
    renderAndWait(pathToFile, pathToOutput, 100 * (i - 1));
    setTimeout(function () {
      phantom.exit();
    }, (100 * amount));
  }
} else {
  phantom.exit();
}
