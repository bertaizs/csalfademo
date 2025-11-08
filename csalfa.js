// To run this script, ensure you have installed the dependency:
// npm install xml2js

const fs = require('fs');
const path = require('path');



const Person = require('./Person.js')
const Picture = require('./Picture.js')

const options = require('./options.js')

const REPL = require('repl')

const xmlFilePath = path.join(__dirname, options.input_file);

var utils = require('./utils.js')
const tag = utils.tag
const lang = utils.lang
const listPeopleLinks = utils.listPeopleLinks


const globals  = require('./globals.js')
const people = globals.people
const parser = globals.parser
const pictures = globals.pictures



function createFile( filename, content ) {
    fs.writeFile(filename, content, err => {
            if (err) {
            console.error(err);
        } else {
            options.log_file_creation && console.log("created: "+filename)
        }
    });
}

function personPage(who) {
    console.log( "personpage: "+who.id)
    let s=""
    s+= `<html><head>
    <title>${who.getName()}</title>
        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />
        <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
        <link rel="stylesheet" href="../style.css">
    </head>
    <body>
    ${options.html_header}


    <table class="person_page_table"><tr>
    <td style="width: 50%;" class="person_page_pictures">${
        pictures.filter(x=>x.shown.includes(who.getId())).map(x=>x.getHtml()).join("\n")
    }</td>
    <td style="width: 50%;" class="person_page_data">
        <h2>${who.getName()}</h2>

        <p>(${who.getBirthAndDeathDates()})</p>
    
        <p>${who.getFather() ? lang("Father")+": "+people[who.getFather().id].getNameLink() : "" }</p>
        <p>${who.getMother() ? lang("Mother")+": "+people[who.getMother().id].getNameLink() : "" }</p>

        ${
            who.getSiblings().length>0 ? "<p>"+lang("Siblings")+": "+listPeopleLinks(who.getSiblings()) : ""
        }
        ${
            who.getChildren().length>0 ? "<p>"+lang("Children")+": "+listPeopleLinks(who.getChildren()) : ""
        }

        ${ who.getComment() ? '<p>'+who.getComment()+'</p>' : "" }

    </td>
    </tr></table>
    

    <div class="footer">${options.html_footer}</div>
    </body>
    </html>
    `
    return s
}


/*
 *      START
 */



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
        new Person(data[tag('person')][i])
    }

    for( let i in data[tag('picture')] ) {
        new Picture(data[tag('picture')][i])
        console.log("pic")
    }
    // console.log(people)



    options.log_people && console.log( people )

    console.log("--------") // this is the place to test new features


    // console.log( people['LukeSkywalker'].getFather().getNameLink() )
    // let kids = people['AnakinSkywalker'].getChildren()
    // console.log( listPeopleLinks(kids) )


    try {
        if (!fs.existsSync(options.tree_dir)) {
            fs.mkdirSync(options.tree_dir);
        }

        for( let i in people )
            createFile( options.tree_dir+'/'+people[i].getFileName(), personPage(people[i]) )

    } catch (err) {
        console.error(err);
    }

    console.log("vége.")

    // if( options.interactive )
    //     REPL.start()
}

