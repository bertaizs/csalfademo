// To run this script, ensure you have installed the dependency:
// npm install xml2js

const fs = require('fs');
const path = require('path');

const Person = require('./Person.js')
const Picture = require('./Picture.js')
const Marriage = require('./Marriage.js')

const languages = require('./lang.js')
const options = require('./options.js')

// const REPL = require('repl')

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

// if str is not empty then returns it with a prefix
function prefix(prefix, str) {
    if(str) return prefix+str
    return ""
}

// if str is not empty then returns it wrapped into div html tags
function asdiv(str, div = 'div') {
    if( str )
        return `<${div}>${str}</${div}>`
    return ""
}

// returns the HTML datasheet of the Person who
function personPage(who) {
    console.log( "personpage: "+who.id)
    let s=""
    s+= `<!DOCTYPE html>
    <html><head>
    <title>${who.getName()}</title>
        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />
        <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
        <link rel="stylesheet" href="../style.css">
    </head>
    <body>
        <div class="header">${options.html_header}</div>

    <table class="person_page_table"><tr>
    <td style="width: 50%;" class="person_page_pictures">${
        pictures.filter(x=>x.shown.includes(who.getId())).map(x=>x.getHtml()).join("\n")
    }</td>
    <td style="width: 50%;" class="person_page_data">
        <h2>${who.getName()}</h2>

        ${prefix( "aka: ", who.getAllNames().slice(1).join(", ") )}

        <p>(${who.getBirthAndDeathYears()})</p>

        ${asdiv( who.getBornData(), 'p' )}
        ${asdiv( who.getDiedData(), 'p' )}
    
        <p>${who.getFather() ? lang("Father")+": "+people[who.getFather().id].getNameLink() : "" }</p>
        <p>${who.getMother() ? lang("Mother")+": "+people[who.getMother().id].getNameLink() : "" }</p>
        ${
            who.getMarriages()
        }
        ${
            who.getSiblings().length>0 ? "<p>"+lang("Siblings")+": "+listPeopleLinks(who.getSiblings()) : ""
        }
        ${
            who.getChildren().length>0 ? "<p>"+lang("Children")+": "+listPeopleLinks(who.getChildren()) : ""
        }
        ${ who.getComment() ? '<p>'+who.getComment()+'</p>' : "" }

        <p>&nbsp;</p>

        ${
            asdiv(who.getParents().length>0 ? who.getNameLink('ancestors', lang("ancestors")+"...") : "")
        }
        ${
            asdiv(who.getChildren().length>0 ? who.getNameLink('descendants', lang("descendants")+"...") : "")
        }

    </td>
    </tr></table>
    
        <div class="footer">${options.html_footer}</div>
    </body>
    </html>`
    return s
}


function treePageLevel2(who, p = {nextlevel: getParents, first: true}) {
    let next = who[p.nextlevel]()
    let s = `
        <table class="treepanel"><tr>
        ${ p.first ? '' : '<td class="treepanel">&mdash;</td>' }
        <td class="treepanel">
                <div style="padding: 0px; text-align: center; ">
                    ${ who.getNameLink() }<br/>
                    ${who.getBirthAndDeathYears()}
                </div>
        </td>
        ${
            next.length>0 ? '<td class="treepanel treepanel_key">&mdash;</td>' : ''
        }
        
        <td class="treepanel"><table class="treepanel">
        `
        for( let i in next ) {
            s+= `<tr><td class="treepanel" style="padding-bottom: 10px;">`
            p.first = false
            s+= treePageLevel( next[i], p)
            s+= `</td></tr>`
        }

    s+= `
        </table></td>
        </tr></table>
    `
    return s
}

function treePageLevel(who, p = {nextlevel: getParents, first: true}) {
    let next = who[p.nextlevel]()

    connector_up = '20px'
    connector_down = connector_up
    // connector_down = '20px'
    line_style = '2px solid black'

    // the first column of a table shows the current person
    let s = `<table class="treepanel" style="border: 0px solid red; padding: 0px; border-spacing: 0px;"><tr>
        <td class="treepanel">
                <div style="padding: 0px; text-align: center; width: 10em;">
                    ${ who.getNameLink() }<br/>
                    ${who.getBirthAndDeathYears()}
                </div>
        </td>`
    
    if( next.length > 0 ) {
        // horizontal line in the middle from the name to the vertical line
        s+= `   
        <td class="treepanel" style="height: 100%;">
            <table style="width: ${connector_down}; height: 100%; padding: 0px; border-spacing: 0px;">
                <tr><td class="treepanel" style="border-bottom: ${line_style};">&nbsp;</td></tr>
                <tr><td class="treepanel">&nbsp;</td></tr>
            </table>
		</td>
        <td class="treepanel">
			<table style="padding: 0; border-spacing: 0px;">`

        // the second next column shows the next level of the tree, a for loop on next
        // the next column shall display the lines connecting these
        for( let i=0; i<next.length; i++ ) {
            upper_style = `border-bottom: ${line_style};`;
            lower_style = ''
            if( i!=next.length-1 ) // not the last line
                lower_style += `border-left: ${line_style};`
            if( i!= 0 ) // not the first line
                upper_style += `border-left: ${line_style};`

            s+= `<tr>
                <td class="treepanel" style="height: 100%;">
                    <table style="padding: 0; border-spacing: 0; height: 100%;"><tr>
                        <td class="treepanel" style="width: ${connector_up}; ${upper_style}">&nbsp;</td>
                    </tr><tr>
                        <td class="treepanel" style="width: ${connector_up}; ${lower_style} ">&nbsp;</td>
                    </tr></table>
                </td>
                <td class="treepanel">
                    ${ treePageLevel( next[i], p) }
                </td>
                </tr>
            `

        }
        s+= `  </tr></table>`
    
    }

    s+= `</td><tr></table>`
    return s
}


function treePage(who, p = {label: "ancestors", nextlevel: 'getParents'} ) {
    console.log( "treepage: "+who.id+", "+p.label)
    let s=""
    s+= `<!DOCTYPE html>
    <html><head>
    <title>${who.getName()} - ${p.label}</title>
        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />
        <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
        <link rel="stylesheet" href="../style.css">
    </head>
    <body>
        <div class="header"><h1>${who.getName()} - ${p.label}</h1></div>

        ${ treePageLevel(who, {'nextlevel': p.nextlevel, first: true}) }

        <div class="footer">${options.html_footer}</div>        
    </body>
    </html>`
    return s
}

/*
 *      START
 */

options.log_args && console.log( process.argv )

// if( process.argv.length>=2)
//     options.input_file = process.argv[2]
// if( process.argv.length>=3)
//     options.input_lang = languages[process.argv[3]]
// if( process.argv.length>=4)
//     options.output_lang = languages[process.argv[4]]

var custom_options = {}
if( process.argv.length>2)
    custom_options = require(process.argv[2])

// console.log(custom_options)

for( let i in custom_options )
    options[i] = custom_options[i]

if( typeof options.input_lang == 'string' )
    options.input_lang = languages[options.input_lang]
if( typeof options.output_lang == 'string' )
    options.output_lang = languages[options.output_lang]
console.log(options)

// throw "kilép"

var xmlFilePath = path.join(__dirname, options.input_file);

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
            // console.log(JSON.stringify(result, null, 2));    // this is to convert to json
            try {
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


// the core part of Csalfa;
// called when the xml file has already been parsed (data)
// this function builds the csalfa data structures: 
// people, array of Person ; pictures, array of Picture
function csalfagen(data) {
    console.log("--- interpreting xml entities ---")
    options.log_data && console.log(data)

    for( let i in data[tag('person')] ) {
        new Person(data[tag('person')][i])
    }
    options.log_people && console.log( people )

    for( let i in data[tag('picture')] ) {
        new Picture(data[tag('picture')][i])
    }

    for( let i in data[tag('marriage')] ) {
        new Marriage(data[tag('marriage')][i])
    }

    console.log("--- processing test cases ---")

    // let kids = people['AnakinSkywalker'].getChildren()
    // console.log( listPeopleLinks(kids) )



    console.log("--- generating output ---")
    try {
        if (!fs.existsSync(options.tree_dir)) {
            fs.mkdirSync(options.tree_dir);
        }

        for( let i in people ) {
            createFile( options.tree_dir+'/'+people[i].getFileName(), personPage(people[i]) )
            createFile( options.tree_dir+'/'+people[i].getFileName('ancestors'), treePage(people[i],   {label: lang("ancestors"),   nextlevel: 'getParents'}) )
            createFile( options.tree_dir+'/'+people[i].getFileName('descendants'), treePage(people[i], {label: lang("descendants"), nextlevel: 'getChildren'}) )
        }
        // createFile( options.tree_dir+'/'+"ancestors"+people['LukeSkywalker'].getFileName(), treePage(people['LukeSkywalker']) )
	
	createFile( options.web_dir+'/index.html', options.index_html )

    } catch (err) {
        console.error(err);
    }

    console.log("--- end ---")

    // if( options.interactive )
    //     REPL.start()
}

