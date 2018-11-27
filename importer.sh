#!/bin/bash

printf "importer.sh launched"

sed -i '' 's/<span class="sentence">//g' maintenance/output.wiki.xml
sed -i '' 's/<\/span>//g' maintenance/output.wiki.xml

javac Counter.java

wait

java Counter

wait

docker cp maintenance/output.wiki.xml wikidition:/var/www/html/maintenance/output.wiki.xml

docker exec wikidition /bin/sh -c "cd maintenance;php importDump.php < output.wiki.xml;php rebuildrecentchanges.php;cd .."


