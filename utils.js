const options = require('./options.js')
const globals = require('./globals.js')
const people = globals.people

// returns the XML tag in the input language
function tag(x) {
    if( x in options.input_lang )
        return options.input_lang[x]
    return x;
}

// translates the English text x to the output language
function lang(x) {
    if( x in options.output_lang )
        return options.output_lang[x]
    return x
}

// converts str to an id of a Person
function ref2id(str) {
    return str.replace( /^#/, "" )
}

// looks for certain attributes in an xml element, extracts a Person id and returns it
function findref( xml, attr = ['id', 'ref']) {
    if( typeof attr == 'string' )
        attr = [attr]

    for( let i in attr )
        if( attr[i] in xml )
            return ref2id(xml[attr[i]])

    console.log(xml)
    throw "no ref found!"
}

// takes an array of People as a input, returns a string: a comma-separated list of html links pointing to their pages
function listPeopleLinks(filteredPeople) {
    return filteredPeople.map( x=>x.getNameLink() ).join(", ")
}

// returns an array of People (from globals.people) matching the criteria/callback
function filterPeople( criteria ) {
    let t = []
    for( let i in people )
        if( criteria(people[i]) )
            t.push(people[i])

    return t
}


module.exports = {
    'tag': tag,
    'lang': lang,
    'filterPeople': filterPeople,
    'listPeopleLinks': listPeopleLinks,
    'ref2id': ref2id,
    'findref': findref,
}