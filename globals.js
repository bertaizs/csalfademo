var people = {}
var pictures = []


// Initialize the XML parser
// The xml2js library allows configuration options, such as:
// { explicitArray: false } to simplify single-item arrays (optional)
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false });
// const parser = new xml2js.Parser({ explicitArray: true });


module.exports = {
    'people': people,
    'pictures': pictures,
    'parser': parser,
}