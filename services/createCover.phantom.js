var page = require('webpage').create();
// page.open('https://google.com', function() {
page.open('https://grappa.cs.helsinki.fi', function() {
  page.viewportSize = { width: 1080, height: 1980 };
  page.clipRect = { top: 0, left: 0, width: 1024, height: 768 };
  page.render('tmp/index.pdf');
  phantom.exit();
});
