#!/bin/bash

printf "importer.sh launched"

sed -i 's/<span class="sentence">//g' maintenance/output.wiki.xml
sed -i 's/<\/span>//g' maintenance/output.wiki.xml

javac Counter.java

wait

java Counter

wait

docker cp maintenance/output.wiki.xml mediawiki:/var/www/html/maintenance/output.wiki.xml

docker cp SimpleTooltip-master/. mediawiki:/var/www/html/extensions/SimpleTooltip

docker cp JsonConfig/. mediawiki:/var/www/html/extensions/JsonConfig

docker cp Graph/. mediawiki:/var/www/html/extensions/Graph

docker exec mediawiki /bin/sh -c "cd maintenance;php importDump.php < output.wiki.xml;php rebuildrecentchanges.php;cd ..;echo 'require_once \"\$IP/extensions/SimpleTooltip/SimpleTooltip.php\";' >> LocalSettings.php; echo 'wfLoadExtension( '\''JsonConfig'\'' );' >> LocalSettings.php; echo 'wfLoadExtension( '\''Graph'\'' );' >> LocalSettings.php"


