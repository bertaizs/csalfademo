// To run this script, ensure you have installed the dependency:
// npm install xml2js

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const Person = require('./Person.js')

var options = require('./options.js')

const REPL = require('repl')

const xmlFilePath = path.join(__dirname, options.input_file);


var people = {}



function tag(x) {
    if( x in options.input_lang )
        return options.input_lang[x]
    return x;
}

function createFile( filename, content ) {
    fs.writeFile(filename, content, err => {
            if (err) {
            console.error(err);
        } else {
            options.log_file_creation && console.log("created: "+filename)
        }
    });
}



/*
 *      START
 */


// Initialize the XML parser
// The xml2js library allows configuration options, such as:
// { explicitArray: false } to simplify single-item arrays (optional)
const parser = new xml2js.Parser({ explicitArray: false });
// const parser = new xml2js.Parser({ explicitArray: true });

// parse the XML file and call csalfagen() if all goes well
function parseXmlFile() {
    console.log(`Attempting to read XML file from: ${xmlFilePath}\n`);

    // Read the XML file asynchronously
    fs.readFile(xmlFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading XML file:', err);
            return;
        }
        // Parse the XML data into a JavaScript object
        parser.parseString(data, (err, result) => {
            if (err) {
                console.error('Error parsing XML data:', err);
                return;
            }
            console.log('--- Successfully Parsed XML Data ---');
            // console.log(JSON.stringify(result, null, 2));
            try {
                // csalfagen(result['család'])
                csalfagen(result[tag('family')])
            } catch (e) {
                console.error('Error accessing data structure:', e);
            }
        });
    });
}

// Check if the file exists before attempting to read
if (fs.existsSync(xmlFilePath)) {
    parseXmlFile();
} else {
    console.error(`Error: XML file not found at ${xmlFilePath}. Make sure 'sample.xml' is in the same directory.`);
}






function csalfagen(data) {
    console.log("--- csalfagen ---")
    options.log_data && console.log(data)

    for( let i in data[tag('person')] ) {
        let p = new Person(data[tag('person')][i])
        people[p.id] = p
    }

    options.log_people && console.log( people )

    console.log("--------")

    // console.log(alma)


    createFile("test.txt", "isti vagyok!")

    // console.log( options )
    // console.log(data['élettárs'])
    console.log("vége.")

    // if( options.interactive )
    //     REPL.start()
}

