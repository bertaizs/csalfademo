// a person in the family tree

var options = require('./options.js')

var utils = require('./utils.js')
var tag = utils.tag
const filterPeople = utils.filterPeople

const globals  = require('./globals.js')
const people = globals.people



class Person {

    // creates this Person by parsing the xml element of person_node
    constructor(person_node) {
        this.id = person_node['$'].id

        this.read('family_name', person_node)
        this.read('given_name', person_node)
        this.read('comment', person_node)
        this.read('born_year', person_node)
        this.read('died_year', person_node)

        if( tag('father') in person_node )
            this['father'] = person_node[tag('father')][0]['$'].id

        if( tag('mother') in person_node )
            this['mother'] = person_node[tag('mother')][0]['$'].id

        people[this.id] = this
        options.log_read_entities && console.log(this.id)
    }

    read(tagname, xml_node, params = {} ) {
        params.first_only ??= true
        params.always_create ??= false

        if( tag(tagname) in xml_node || params.always_create )
            this[tagname] = params.first_only ? xml_node[tag(tagname)][0] : xml_node[tag(tagname)]
    }

    getFather() {
        if( 'father' in this && this.father in people ) return people[this.father]
        return null
    }
    getMother() {
        if( 'mother' in this && this.mother in people ) return people[this.mother]
        return null
    }

    getChildren() {
        return filterPeople(x=>(x.getFather()==this || x.getMother()==this))
    }

    getSiblings() {
        return filterPeople(x=>((x.getFather()==this.getFather() || x.getMother()==this.getMother())) && x!=this )
    }


    getName() {
        if( 'family_name' in this && 'given_name' in this ) {
            if( options.output_lang.family_name_first )
                return this['family_name']+" "+this['given_name']   // in e.g. Hungarian
            else
                return this['given_name']+" "+this['family_name']   // in e.g. English
        }
        return false
    }

    getId() { return this.id }
    getFileName() {
        if( 'filename' in this ) return this.filename+".html"
        return this.getId()+".html"
    }

    getNameLink() {
        return `<a href="${this.getFileName()}">${this.getName()}</a>`
    }

    getBirthDate() {
        if( 'born_year' in this ) {
            return this.born_year
        }
        else return false
    }
    getDeathDate() {
        if( 'died_year' in this ) {
            return this.died_year
        }
        else return false
    }

    getBirthAndDeathDates() {
        return (this.getBirthDate()||"")+' &ndash; '+(this.getDeathDate()||"")
    }

    getComment() {
        if( 'comment' in this ) return this.comment
        return ""
    }

}


module.exports = Person
