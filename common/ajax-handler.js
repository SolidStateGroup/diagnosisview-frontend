/**
 * Created by kyle-ssg on 02/03/15.
 */
module.exports = {
  error: async function (store, res) {

    try {
     var json = await res.json();
    } catch (e) {

    }

      var error = json || res.statusText || res.message || res,
          url = res.url;

      if (!json) {
        try {
            error = JSON.parse(res._bodyText).error.message;
        } catch (e) {

        }
      }

      switch (res.status) {
          case 404:
              console.log(error + ' Not found: ' + url);
              //ErrorModal(null, error + ' Not found: ' + url);
              break;
          case 503:
              console.log('Service unavailable: ' + url);
              //ErrorModal(null, 'Service unavailable: ' + url);
              break;
          default:
              console.log(error);
              console.log(res);
              console.log(url);
      }

      if (store) {
          console.log("ERROR", error, store.id);
          store.error = error;
          store.goneABitWest(res);
      }
  }
};