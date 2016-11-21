var page = require('webpage').create();
page.paperSize = {
  height: '11in',
  width: '8.5in',
  // height: '792px',
  // width: '612px',
  // margin: {
  //   top: '50px',
  //   left: '20px'
  // }
};
// page.open('https://google.com', function() {
// page.open('https://grappa.cs.helsinki.fi', function() {
page.open("test/test-cover.html", function() {
  // page.viewportSize = { width: 1080, height: 1980 };
  // page.viewportSize = {
  //   height: 792,
  //   width: 612,
  // };
  // page.clipRect = {
  //   top: 0,
  //   left: 0,
  //   height: 1056,
  //   width: 864,
  // };
  page.render('tmp/index.pdf');
  phantom.exit();
});
