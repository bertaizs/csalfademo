var options = require('./options.js')

function tag(x) {
    if( x in options.input_lang )
        return options.input_lang[x]
    return x;
}


module.exports = {
    'tag': tag
}