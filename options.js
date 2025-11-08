
const [english, magyar] = require('./lang.js')

var options = {
    version: "2.0",
    input_lang: english,    // output language; english or magyar
    output_lang: english,    // output language; english or magyar
    input_file: "skywalker.xml",

    tree_dir: "fa",     // without / at the end

    html_header: `<h1>Csalfa Family Tree</h1><hr/>`,
    html_footer: `<hr/>footer`,

    log_data: false,
    log_read_entities: true,
    log_people: true,
    log_file_creation: true,

    // interactive: true,

}

module.exports = options
