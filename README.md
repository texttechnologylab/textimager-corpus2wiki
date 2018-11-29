# textimager-wikidition

## Installation:

Requirements: docker and docker-compose need to be installed

1. Download this repo
2. Runn installation, configuration and start containers using docker-compose -f stack.yml up (if you want a newly compiled wikidition container, add --build)
3. Open your browser and go to localhost:8080 

Mediawiki is now set up with the following parameters:

```
- MW_ADMIN_USER=admin
- MW_ADMIN_PASS=password
- MW_DB_NAME=wikidb
- MW_DB_USER=mediawiki
- MW_DB_PASS=wikidbpw
- MW_DB_INSTALLDB_USER=root
- MW_DB_INSTALLDB_PASS=wikiexporterpw
```

## Run wikiexporter:

Place the textfiles to be analyzed into the corpus folder and then run
```
java dumpCreator 
```
and that's it! 

## Access Results
visit localhost:8080 (or the adress that is indicated in the terminal during service startup - This needs to be fixed), visit "localhost/index.php/Corpus" and you should see a list of links to your files - click on any one of them and your text (with grammatical infos as tool tips) will be visible.

## File information
dumper.sh: 	runs the CLI jar
 
importer.sh:	
-copies the output (XML) file into the maintenance file in container
-copies the SimpleTooltip, Graph and JSon extension into extensions file in container
-runs importDump.php and rebuilds mediawiki
-adds the line "require_once "$IP/extensions/SimpleTooltip-master/SimpleTooltip.php" (and all other extension configs)	to the LocalSettings.php file (runs the extensions)

dumpCreator.java: creates processes for both scripts and runs them. 
