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
        for( let i in person_node ) {
            if( i!='$')
                this[i] = person_node[i]
        }
        console.log(this.id)

        this.read('family_name', person_node)
        this.read('given_name', person_node)

        if( tag('father') in this )
            this['father'] = this[tag('father')]['$'].id
        if( tag('mother') in this )
            this['mother'] = this[tag('mother')]['$'].id

        people[this.id] = this


        options.log_read_entities || console.log(this.id)
    }

    read(tagname, person_node) {
        this[tagname] = person_node[tag(tagname)]
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

}


module.exports = Person
