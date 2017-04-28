const exec = require('child_process').exec;
const CDP = require('chrome-remote-interface');

exec('/Applications/Google\\ Chrome\\ Canary.app/Contents/MacOS/Google\\ Chrome\\ Canary --headless --remote-debugging-port=9222', (err) => {
  if (err) {
   console.error(`exec error: ${err}`);
   return;
 } else {
   console.log("Is anything going on here?");
 }
});


setTimeout(() => {
  CDP(client => {
    // extract domains
    const { Network, Page } = client;
    // setup handlers
    Page.loadEventFired(() => {
      client.close();
    });
    Network.loadingFinished(responseObj => {
      Network.getResponseBody({requestId: responseObj.requestId}, (err, params) => {
        if(err) {
          conosle.error(params);
          return;
        }
        if(params.base64Encoded === false) {
          if(params.body.indexOf('DOCTYPE') !== -1) {
            console.log(params.body);
          }
        }
      })
    })
    // enable events then start!
    Promise.all([Network.enable(), Page.enable()])
      .then(() => {
        return Page.navigate({ url: 'http://www.footlocker.com/product/model:276706/sku:80869100/nike-air-shake-ndestrukt-mens/' });
      })
      .catch(err => {
        console.error(err);
        client.close();
      });
  }).on('error', err => {
    // cannot connect to the remote endpoint
    console.error(err);
  });

}, 150);
