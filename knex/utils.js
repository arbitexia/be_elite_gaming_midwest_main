const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const loadEmailTemplateCSV = () =>
  new Promise((resolve, reject) => {
    let index = 0;
    let results = [];
    let formatFields = {};
    fs.createReadStream(path.resolve(__dirname, './seeds/email.csv'))
      .pipe(parse({ delimiter: ',' }))
      .on('data', (data) => {
        if (index === 0) {
          data.forEach((el, i) => {
            formatFields = {
              ...formatFields,
              [i]: el
            };
          });
        } else {
          let rowData = {};
          Object.keys(formatFields).forEach((field) => {
            if (field !== '0') {
              rowData = {
                ...rowData,
                [formatFields[field]]: data[field]
              };
            }
          });
          results.push(rowData);
        }
        index += 1;
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });

module.exports = { loadEmailTemplateCSV };
