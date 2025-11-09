
var options = require('./options.js')

const utils = require('./utils.js')
const tag = utils.tag
const ref2id = utils.ref2id
const findref = utils.findref

const globals  = require('./globals.js')
const people = globals.people
const pictures = globals.pictures

class Marriage {
    constructor(xml_node) {

        let who = findref(xml_node['$'], tag('who'))
        let whom = findref(xml_node['$'], tag('whom'))

        console.log(who)
        console.log(whom)

        let t = {'with': whom }
        t['when'] = xml_node['$'][tag('when')]
        t['comment'] = xml_node['$'][tag('comment')]
        t['label'] = xml_node['$'][tag('label')]
        // if( t.label ) {
        //     console.log(t)
        // throw "kilép"
        //     }

        people[who].spouse.push( t )
        let t2 = structuredClone(t)
        t2.with = who
        people[whom].spouse.push( t2 )

    }
}

module.exports = Marriage
