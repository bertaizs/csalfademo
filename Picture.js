
var options = require('./options.js')

const utils = require('./utils.js')
const tag = utils.tag
const ref2id = utils.ref2id

const globals  = require('./globals.js')
const people = globals.people
const pictures = globals.pictures

class Picture {



    // creates this Picture by parsing the xml element of picture_node
    constructor(xml_node) {
        this.file = xml_node['$'].file
        if( tag('comment') in xml_node['$'] )
            this.comment = xml_node['$'][tag('comment')]

        if( tag('name') in xml_node['$'] )
            this.name = xml_node['$'][tag('name')]

        this.shown = []
        if( tag('shown') in xml_node )
            this.shown = xml_node[tag('shown')]
        this.shown = this.shown.map( x=>ref2id(x['$'][tag('who')]) )
        // !!! TODO:  handle where we have a name only about who is on the picture
        // !!! TODO:  support newline

        pictures.push(this)

        options.log_read_entities && console.log("picture: "+this.file.substring(0,70))
    }

    // read(tagname, xml_node) {
    //     if( tag(tagname) in xml_node)
    //         this[tagname] = xml_node[tag(tagname)]
    // }

    getHtml() {
        let s = ''
        s+= `<p>
        <a href="${this.file}" target="_top"><img src="${this.file}" class="pic"/></a> <br/>
        ${this.shown.map(x=>{
                if(x in people) return people[x].getNameLink()
                return x
            }).join(", ")
        }
        ${'comment' in this ? "<br/>"+this.comment : ""}
        </p>`
        return s
    }

}

module.exports = Picture

