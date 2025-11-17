
# generates family tree for the Skywalker family; demo only
skywalker:
	node ./csalfa.js 
#	cp skywalker.xml www/
#	cp style.css www/


upload: skywalker
	gcloud config set project csalfademo-berta-hu
	gcloud app deploy

csalfa:
	node ./csalfa.js ./berta.js

# installs prereqs, creates environment
install:
	 npm install xml2js
	 mkdir www/



