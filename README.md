# textimager-wikidition

DEPENDENCIES: textimager-client (should this also be included in docker image?)

1. Create a directory for your project.
2. Download mediawiki image, stack.yml file, java files & scripts to this directory and run using docker-compose -f stack.yml up
3. Open your browser and go to localhost:8080
4. Follow the mediawiki wizard for set up: for language, admin account etc., enter your own preferences, and for the database entries, please use the following entries:
Database type: MySQL
Database host: database
Database name: wikidb
Database table prefix: LEAVE BLANK
Database username: root
Database password: wikiexporterpw
Check the box for "use the same a/c as for installation"
Storage Engine: InnoDB
Name of wiki and following settings: your choice
5. Once the set up is complete, a file called LocalSettings.php will be downloaded. Save this file to your working directory.
6. Now go into the stack.yml file, uncomment the LocalSettings.php line, and re run it. (using command from above)
7. Now go to localhost:8080 again and you should have a mediawiki all set up and ready to go!

To run wikiexporter:

Run java dumpCreator - and that's it! 

visit localhost:8080, visit "localhost/index.php/Corpus" and you should see a list of links to your files - click on any one of them and your text (with grammatical infos as tool tips) will be visible.

dumper.sh: 	runs the CLI jar
 
importer.sh:	
-copies the output (XML) file into the maintenance file in container
-copies the SimpleTooltip extension into extensions file in container
-runs importDump.php and rebuilds mediawiki
-adds the line "require_once "$IP/extensions/SimpleTooltip-master/SimpleTooltip.php" 			to the LocalSettings.php file (runs the extension)

dumpCreator.java: creates processes for both scripts and runs them. 

NOTES:  	
- XML builder does not react well to & ampersands in input texts
- Span tags need to be removed for output to show (sed currently used to fix this)

TODO:
- Amend file names for generalised usage
- Generate LocalSettings.php automatically and run everything from Dockerfile.
- Add functionality to facilitate WYSIWYG editing of grammatical info.
