var page = require('webpage').create();
page.paperSize = {
  height: '11in',
  width: '8.5in',
};

var args = require('system').args;

if (args[1] && args[2]) {
  const pathToFolder = args[1];
  const amount = parseInt(args[2]);
  for(var i = 0; i < amount; i++) {
    console.log("LOOPING")
    // console.log(pathToFolder + "/" + i + ".html")
    setTimeout(function () {
      // page.open(pathToFolder + "/" + i + ".html", function() {
      page.open('tmp/0.html', function() {
        console.log("juu")
        page.render(pathToFolder + "/" + i + ".pdf");
        if ((i + 1) === amount) {
          phantom.exit();
        }
      });
    }, 100 * i);
  }
}
