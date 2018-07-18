#!/bin/bash

sed -i 's/<span class="sentence">//g' maintenance/output.wiki.xml
sed -i 's/<\/span>//g' maintenance/output.wiki.xml

javac Counter.java

wait

java Counter

wait

docker cp maintenance/output.wiki.xml textimager-wikidition_mediawiki_1:/var/www/html/maintenance/output.wiki.xml

docker cp SimpleTooltip-master/. textimager-wikidition_mediawiki_1:/var/www/html/extensions/SimpleTooltip

docker cp JsonConfig/. textimager-wikidition_mediawiki_1:/var/www/html/extensions/JsonConfig

docker cp Graph/. textimager-wikidition_mediawiki_1:/var/www/html/extensions/Graph

docker exec textimager-wikidition_mediawiki_1 /bin/sh -c "cd maintenance;php importDump.php < output.wiki.xml;php rebuildrecentchanges.php;cd ..;echo 'require_once \"\$IP/extensions/SimpleTooltip/SimpleTooltip.php\";' >> LocalSettings.php; echo 'wfLoadExtension( '\''JsonConfig'\'' );' >> LocalSettings.php; echo 'wfLoadExtension( '\''Graph'\'' );' >> LocalSettings.php"


