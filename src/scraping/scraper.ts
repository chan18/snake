import rp from 'request-promise';
import cheerio from 'cheerio';
import request from 'request';
import fs from 'fs';
import filesaver from 'file-saver';

export class Scraper {
  constructor() {}

  // Method to get the user script from gist
  GetPageContent(url, username, callback): boolean {
    let requestResult = false;
    let filePath = url + '';

      // Request the userscript
      let req = request(url, function (error, response, body) {
        console.log('Errors: ' + '\n' + 'Response: ' + response.statusCode + '\n');

        // Checks if there was an error requesting
        if (error === null && response.statusCode === 200) {
          requestResult = true;

          // TODO Wait for electron so its saved locally
          // Save the content of the userscript to a new file (username.ts)
          let filename = username + '.ts';
          let blob = new Blob([body], {type: 'text/plain;charset=utf-8'});
          filesaver.saveAs(blob, filename);

          // Returns the result of the request
          callback(requestResult);
        }

      });
    console.log(requestResult);
    return requestResult;
  }
}
