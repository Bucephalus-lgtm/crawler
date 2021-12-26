const fs = require('fs');
const { Parser } = require('json2csv');
const j2cp = new Parser();

// Save the data as CSV file in the roor directory
module.exports.saveCSVFile = async outputData => {
    try {
        const csv = j2cp.parse(outputData);
        fs.writeFileSync("./output.csv", csv, "utf-8");
        console.log('CSV file saved successfully!');
    } catch (err) {
        console.error(err);
        throw err;
    }
}