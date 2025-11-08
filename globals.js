var people = {}
var pictures = []

// Initialize the XML parser
const xml2js = require('xml2js');
    
// explicitArray: true -- we always ask subnodes in an array, even if there is one only
const parser = new xml2js.Parser({ explicitArray: true });

module.exports = {
    'people': people,
    'pictures': pictures,
    'parser': parser,
}
