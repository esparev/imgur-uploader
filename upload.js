/**
 * Saves the previously uploaded image file from Imgur
 * and it stores it in the browser's local storage with
 * the key: imgur image
 * @param {*} res - response object
 */
var feedback = function (res) {
  if (res.success === true) {
    var imgurURL = res.data.link.replace(/^http:\/\//i, 'https://');
    localStorage.setItem('actor image', imgurURL);
    window.dispatchEvent(new Event('storage'));
  }
};

new Imgur({
  clientId: '1b3c80e45e9f3ce',
  callback: feedback,
});
