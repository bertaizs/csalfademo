// a person in the family tree

var options = require('./options.js')


class Person {

    constructor(person_node) {
        this.id = person_node['$'].id
        for( let i in person_node ) {
            if( i!='$')
                this[i] = person_node[i]
        }
        console.log(this.id)

        if( 'apja' in this )
            this['father'] = this['apja']['$'].id
        if( 'anyja' in this )
            this['mother'] = this['anyja']['$'].id

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
        return this['vezetéknév']+" "+this['keresztnév']
    }

    getId() { return this.id }
    getFileName() {
        if( 'filename' in this ) return this.filename
        return this.getId()
    }

}


module.exports = Person