// a person in the family tree

var options = require('./options.js')

var utils = require('./utils.js')
var tag = utils.tag

class Person {

    // creates this Person by parsing the xml element of person_node
    constructor(person_node) {
        this.id = person_node['$'].id
        for( let i in person_node ) {
            if( i!='$')
                this[i] = person_node[i]
        }
        console.log(this.id)

        if( tag('father') in this )
            this['father'] = this[tag('father')]['$'].id
        if( tag('mother') in this )
            this['mother'] = this[tag('mother')]['$'].id

        options.log_read_entities || console.log(this.id)
    }

    getFather() {
        if( 'father' in this && this.father in people ) return people[this.father]
        return null
    }
    getMother() {
        if( 'mother' in this && this.mother in people ) return people[this.mother]
        return null
    }

    getName() {
        return this['surname']+" "+this['given_name']
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
        return this.born_year
    }
    getDeathDate() {
        if( 'died_year' in this ) {
            return this.died_year
        }
        else return false
    }

}


module.exports = Person