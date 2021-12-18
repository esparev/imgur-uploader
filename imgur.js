/**
 * Provides the service to upload a file image
 * and return its equivalent in a URL result
 * stored at imgur's website
 * @function run - Initialize a chain reaction of executing methods
 * starting from the upload method
 * @function upload - Adds an event listener to the provided identified HTML tag
 * and calls the matchFiles to verify the provided file
 * @function matchFiles - Verifies if the provided file is the image type and its not
 * a svg or xml image type and calls the post function
 * @function post - Posts the provided image to its respective API endpoint
 */
class Imgur {
  constructor(options) {
    if (!this || !(this instanceof Imgur)) {
      return new Imgur(options);
    }

    if (!options) {
      options = {};
    }

    if (!options.clientId) {
      throw 'Proporcione un Client-ID válido';
    }

    this.clientId = options.clientId;
    this.endpoint = 'https://api.imgur.com/3/image';
    this.callback = options.callback || undefined;
    this.dropzone = document.getElementById('drop-zone');
    this.run();
  }
  /**
   * Posts the provided image to its respective API endpoint
   * @param {*} path - API endpoint
   * @param {*} data - image file
   * @param {*} callback - next function to execute
   */
  post(path, data, callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.open('POST', path, true);
    xhttp.setRequestHeader('Authorization', 'Client-ID ' + this.clientId);
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 300) {
          var response = '';
          try {
            response = JSON.parse(this.responseText);
          } catch (err) {
            response = this.responseText;
          }
          callback.call(window, response);
        } else {
          throw new Error(this.status + ' - ' + this.statusText);
        }
      }
    };
    xhttp.send(data);
    xhttp = null;
  }
  /**
   * Verifies if the provided file is the image type and its not
   * a svg or xml image type and calls the post function
   * @param {*} file - uploaded file
   */
  matchFiles(file) {
    if (file.type.match(/image/) && file.type !== 'image/svg+xml') {
      var fd = new FormData();
      fd.append('image', file);

      this.post(
        this.endpoint,
        fd,
        function (data) {
          typeof this.callback === 'function' && this.callback.call(this, data);
        }.bind(this)
      );
    }
  }
  /**
   * Adds an event listener to the provided identified HTML tag
   * and calls the matchFiles to verify the provided file
   * @param {*} zone - identified HTML drop zone tag
   */
  upload(zone) {
    var file, target;

    zone.addEventListener(
      'change',
      function (e) {
        try {
          if (
            e.target &&
            e.target.nodeName === 'INPUT' &&
            e.target.type === 'file'
          ) {
            target = e.target.files;
            for (let i = 0; i < target.length; i++) {
              file = target[i];
              this.matchFiles(file, zone, [i, target.length]);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }.bind(this),
      false
    );
  }
  /**
   * Initialize a chain reaction of executing methods
   * starting from the upload method
   */
  run() {
    this.upload(this.dropzone);
  }
}
