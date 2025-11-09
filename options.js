
const languages = require('./lang.js')

var options = {
    version: "2.0",
    input_lang: languages.english,    // output language; english or magyar
    output_lang: languages.english,    // output language; english or magyar
    input_file: "skywalker.xml",

    tree_dir: "www/tree",     // without / at the end
    web_dir:  "www",

    html_header: `<h1>Csalfa Family Tree</h1><hr/>`,
    html_footer: `<hr/>`+new Date(),

    index_html: `<html><head><title>Csalfa Demo</title></head><body>
    		<h1>Csalfa Demo</h1>

	<p>This is a demo of the Csalfa (Family Tree) tool.
	The input of the tool is an xml file describing the family and a set of pictures about the family.
	The tool generates a set of html pages you can use for browsing the family tree.
	</p>
	<p>
	This pages contains a demo of the Skywalker family tee. 
	You may start e.g. at 
	<a href="tree/AnakinSkywalker.html">Anakin Skywalker</a>.
	This very simple family tree is generated based on this
	<a href="skywalker.xml">skywalker.xml</a>.
	</p>

	<p>
	Please find further details at 
	<a href="https://github.com/bertaizs/csalfademo">https://github.com/bertaizs/csalfademo</a>.
	</p>

	<div style="color: lightgray">
	<hr/>
	csalfa - from <a href="https://berta.hu">berta.hu</a> - 2019
	</div>

	</body></html>`,

    log_data: false,
    log_read_entities: true,
    log_people: true,
    log_file_creation: true,

    log_args: true,

    // interactive: true,

}

module.exports = options
