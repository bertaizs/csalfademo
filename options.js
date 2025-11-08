
const languages = require('./lang.js')

var options = {
    version: "2.0",
    input_lang: languages.english,    // output language; english or magyar
    output_lang: languages.english,    // output language; english or magyar
    input_file: "skywalker.xml",

    tree_dir: "fa",     // without / at the end

    html_header: `<h1>Csalfa Family Tree</h1><hr/>`,
    html_footer: `<hr/>`+new Date(),

    log_data: false,
    log_read_entities: true,
    log_people: true,
    log_file_creation: true,

    log_args: true,

    // interactive: true,

}

module.exports = options
