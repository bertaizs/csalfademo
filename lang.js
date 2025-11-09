

var english = {
    // 'person': 'person',

    family_name_first: false,

    born_data: ['born_month', 'born_day', 'born_year'],
    died_data: ['died_month', 'died_day', 'died_year'],
}

var magyar = {
    // tags
    'family': 'család',
    'person': 'személy',
    'father': 'apja',
    'mother': 'anyja',

    'family_name': 'vezetéknév',
    'given_name': 'keresztnév',
    'name': 'név',
    'prefix': 'előtag',

    'born_year': 'születési_év',
    'born_month': 'születési_hónap',
    'born_day': 'születési_nap',
    'born_place': 'születési_hely',
    'died_year': 'halálozási_év',
    'died_month': 'halálozási_hónap',
    'died_day': 'halálozási_nap',
    'died_place': 'halálozási_place',

    born_data: ['"Született:"', 'born_year', '~.', 'born_month', 'born_day', '~.'],
    died_data: ['"Meghalt: "', 'died_year', '~.', 'died_month', 'died_day', '~.'],

    'comment': 'megjegyzés',

    'marriage': 'házasság',
    
    'picture':  'kép',
    'shown':    'látszik',
    'who':      'ki',
    'whom':     'kivel',
    'when':     'mikor',
    'newline':  'újsor',

    // strings
    "Father": "Apja",
    "Mother": "Anyja",
    "Children": "Gyermekei",
    "Siblings": "Testvérei",

    "Spouse": "Házastársa",

    family_name_first: true,
}


module.exports = {
    'english': english,
    'magyar': magyar,
}
