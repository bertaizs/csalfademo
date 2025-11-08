const options = require('./options.js')
const globals = require('./globals.js')
const people = globals.people

function tag(x) {
    if( x in options.input_lang )
        return options.input_lang[x]
    return x;
}

function lang(x) {
    if( x in options.output_lang )
        return options.output_lang[x]
    return x
}

function listPeopleLinks(filteredPeople) {
    return filteredPeople.map( x=>x.getNameLink() ).join(", ")
}


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
}