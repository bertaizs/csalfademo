// a person in the family tree

var options = require('./options.js')

const utils = require('./utils.js')
const tag = utils.tag
const filterPeople = utils.filterPeople
const ref2id = utils.ref2id
const lang = utils.lang

const globals  = require('./globals.js')
// const lang = require('./lang.js')
const people = globals.people



class Person {

    // creates this Person by parsing the xml element of person_node
    constructor(person_node) {
        this.id = ref2id(person_node['$'].id)

        let data = [    'family_name', 'given_name', 'prefix', 'comment',
                        'born_year', 'born_month', 'born_day', 'born_place',
                        'died_year', 'died_month', 'died_day', 'died_place',
                    ]
        for( let i in data )
            this.read( data[i], person_node )

        this.read('name', person_node, {first_only: false, always_create: true})

        if( tag('father') in person_node )
            this['father'] = ref2id( person_node[tag('father')][0]['$'].id )

        if( tag('mother') in person_node )
            this['mother'] = ref2id( person_node[tag('mother')][0]['$'].id )

        this.spouse = []

        people[this.id] = this
        options.log_read_entities && console.log(this.id)
    }

    read(tagname, xml_node, params = {} ) {
        params.first_only ??= true
        params.always_create ??= false

        if( tag(tagname) in xml_node || params.always_create )
            this[tagname] = params.first_only ? 
                                xml_node[tag(tagname)][0] || "": 
                                (xml_node[tag(tagname)] || [])
    }

    getFather() {
        if( 'father' in this && this.father in people ) return people[this.father]
        return null
    }
    getMother() {
        if( 'mother' in this && this.mother in people ) return people[this.mother]
        return null
    }

    getParents() {
        let t = []
        if( this.getFather() ) t.push( this.getFather() )
        if( this.getMother() ) t.push( this.getMother() )
        return t
    }

    getChildren() {
        return filterPeople(x=>(x.getFather()==this || x.getMother()==this))
    }

    getSiblings() {
        return filterPeople(x=>(
                ((x.getFather()==this.getFather()) && x.getFather())
            ||  ((x.getMother()==this.getMother()) && x.getMother())
        ) && x!=this 
        )
    }

    getNameFromParts() {
        if( 'family_name' in this && 'given_name' in this ) {
            if( options.output_lang.family_name_first )
                return [this['prefix'], this['family_name'], this['given_name']].join(" ") // Hungarian
            else
                return [this['prefix'], this['given_name'], this['family_name']].join(" ") // English
                // return this['given_name']+" "+this['family_name']   // in e.g. English
        }
        return false
    }

    getAllNames() {
        return [this.getNameFromParts()].concat(this.name)
    }

    getName() { return this.getAllNames()[0] }

    getId() { return this.id }
    getFileName( type = "") {
        if( 'filename' in this ) return this.filename+(type?'_'+type:'')+".html"
        return this.getId()+(type?'_'+type:'')+".html"
    }

    getNameLink(type = "", text = "") {
        return `<a href="${this.getFileName(type)}">${text?text:this.getName()}</a>`
    }

    getBirthYear() {
        if( 'born_year' in this ) {
            return this.born_year
        }
        else return false
    }
    getDeathYear() {
        if( 'died_year' in this ) {
            return this.died_year
        }
        else return false
    }

    getBirthAndDeathYears() {
        return (this.getBirthYear()||"")+' &ndash; '+(this.getDeathYear()||"")
    }

    getData(data) {
        // let s = ""
        if( 'born_year' in this ) {
            let t = []
            for( let i in data ) {
                if( this[data[i]] )
                    t.push(this[data[i]])
                else {
                    let m = data[i].match(/"(.*)"/)
                    if( m )
                        t.push(m[1])

                    m = data[i].match(/~(.*)/)

                    if( m && t.length>0 && !t[t.length-1].endsWith(m[1]))
                        t[t.length-1] += m[1]
                }
            }
            return t.join(" ")
        }
        return ""
    }

    hasDetailedBornDate() {
        return ('born_month' in this && this['born_month']!='?')
    }
    hasDetailedDiedDate() {
        return ('died_month' in this && this['died_month']!='?')
    }

    getBornData() { return this.hasDetailedBornDate() ? this.getData(options.output_lang.born_data) : "" }
    getDiedData() { return this.hasDetailedDiedDate() ? this.getData(options.output_lang.died_data) : "" }

    getComment() {
        if( 'comment' in this ) return this.comment
        return ""
    }

    getMarriages() {
        let s = ''
        for( let i in this.spouse ) {
            s+= `<p>`
            s+= lang(this.spouse[i].label ?? 'Spouse')+": "
            s+= people[this.spouse[i].with].getNameLink()
            if( this.spouse[i].when )
                s+= " ("+this.spouse[i].when+") "
            if( this.spouse[i].comment )
                s+= " - "+this.spouse[i].comment
            s+= `</p>`
        }
        return s
    }

}


module.exports = Person
