
# What is Csalfa?

Csalfa is a *family tree* tool that takes as input an XML description of the family and family pictures, and creates a set of HTML pages you can use for browsing the family tree.

# Why Csalfa?

I started Csalfa back in the 90s to create a tool for preserving family tree data. 
Family tree data is obvious -- for a while. When old family members pass away, often the knowledge of where they came from passes with them. 
Our source data came from interviewing old members of the family, their old photos and papers, with some papers being older than 100 years.
The plan was to build technology that lasts, so that it is:

- Robust: Depends on as little infrastructure as possible. 
- Future-proof: Core formats and technologies should be usable for a while. 
- Offline: Family tree information is sensitive, I did not want to upload it anywhere. Online also somewhat contradicts the first two principles.

Today there are flashy sites where you can upload and share family data. This tool is for people who don't want to use those.


# How Csalfa works?

Csalfa consists of the following:
* an XML file describing the family
* family photos in a folder
* a tool for parsing the XML file and generating the output -- this is in JavaScript / node.js
* the output is a set of HTML pages (and the pictures)

The first two are super essential for preserving family history. The third one, the tool, does not need to be that future-proof, it can be replaced (and has been replaced multiple times). It is not rocket science to generate data from the 

When you *view* the family tree, you do not actually 'run' anything, you are just viewing the HTML files. Hopefully HTML is going to be viewable for a couple of decades.


# Demo

You can try csalfa at: <https://csalfademo.berta.hu> with the Skywalker family from Star Wars.
The demo uses [this xml file](https://csalfademo.berta.hu/skywalker.xml).


# What did I learn?


# XML format

The outer element of the XML is called `family`. The following elements can reside inside this outer element:

* `person`: Describes data about a person. It must have an attribute called `id` which must be unique. (Good practice: birth-year + birth name) The following elements can reside inside:
   - `family_name`: there can be only one
   - `given_name`: there can be only one
   - `prefix`: e.g. 'Dr.' or 'Jr.', there can be only one
   - `name`: unstructured name of the person; there can be more. The 'name' of the person is either a combination of `family_name`, `given_name` and `prefix` or the first `name` element

   - `birth_year`: string, optional; family data is suprisingly unstructured; the more you go back in time the more people you will see where this is unknown '?' or somewhat uncertain '184x' or completely missing
   - `birth_month`, `birth_day`, `birth_place`: other optional strings;
   - `death_year`: string, optional; *the person is considered dead if this is populated*
   - `death_month`, `death_day`, `death_place`: other optional strings;

   - `father` and `mother`: these must have an attribute either called `id` or `ref` which points to the `person` who is this person's biological father/mother

   - `comment`: anything

* `marriage`: Declares a marriage between two `person`s. Must have two attributes `who` and `whom` containing the `id`s of the person referred. There is no differentiation between the two parties. The referred `person`s must already be defined in the XML file. This element can contain the below optional attributes:
   - `when`: date of the marriage or info about that, string
   - `comment`: string
   - `label`: by default the person married to someone is displayed as 'Spouse'; if `label` is present, that will be displayed instead (e.g. 'Partner').

* `picture`: Declares a picture. Must have an attribute `file` which is a path+filename or URL where the file is found. Sub elements:
   - `shown`: its attribute `who` refers to the `person`s `id`.

[Example csalfa XML file](https://csalfademo.berta.hu/skywalker.xml).


# Options

The file options.js contains:

- input_file: the XML file to be used
- input_lang: language of the input XML file (i.e. tag names)
- output_lang: language of the output HTML files
- web_dir: this is where the output goes
- tree_dir: this is where the family tree HTML files go


If the script receives a command-line parameter, it reads it as a js file which overrides what is set in options.js.


# Dependencies

The tool generating Csalfa output runs under node.js and uses xml2js for parsing the XML. It can be installed as

`npm install xml2js`

Viewing the output does not need any special tool.


# History
The original csalfa generator was written in 1990s in Java.

Later on it was rewritten in PHP. It did not turn out robust enough, and was difficult to maintain as PHP syntax often changed and was compatible.

The current version is in JavaScript / node.js.


# Todo

* pics dir
* upload scripts, app.yaml
* good footer

