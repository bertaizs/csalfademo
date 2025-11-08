
var options = require('./options.js')

var utils = require('./utils.js')
var tag = utils.tag

const globals  = require('./globals.js')
const people = globals.people
const pictures = globals.pictures

class Picture {


    // creates this Picture by parsing the xml element of picture_node
    constructor(xml_node) {
        this.file = xml_node['$'].file
        if( tag('comment') in xml_node['$'] )
            this.comment = xml_node['$'].comment
        
        this.shown = []
        if( tag('shown') in xml_node )
            this.shown = xml_node[tag('shown')]
        this.shown = this.shown.map( x=>x['$'][tag('who')])

        pictures.push(this)

        options.log_read_entities || console.log("picture...")
    }

    // read(tagname, xml_node) {
    //     if( tag(tagname) in xml_node)
    //         this[tagname] = xml_node[tag(tagname)]
    // }

    getHtml() {
        let s = ''
        s+= `<p>
        <a href="${this.file}"><img src="${this.file}" class="pic"/></a> <br/>
        ${this.shown.map(x=>people[x].getNameLink()).join(", ")}
        ${'comment' in this ? "<br/>"+this.comment : ""}
        </p>`
        return s
    }

}

module.exports = Picture

