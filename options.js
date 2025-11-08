
const [english, magyar] = require('./lang.js')

var options = {
    version: "2.0",
    input_lang: english,    // output language; english or magyar
    output_lang: english,    // output language; english or magyar
    input_file: "skywalker.xml",


    log_data: false,
    log_read_entities: true,
    log_people: false,
    log_file_creation: true,

    interactive: true,

}

module.exports = options
