#!/bin/bash

sed -i 's/<span class="sentence">//g' ~/textimager-client/target/output/output.wiki.xml
sed -i 's/<\/span>//g' ~/textimager-client/target/output/output.wiki.xml

javac Counter.java

wait

java Counter

wait

docker cp ~/textimager-client/target/output/output.wiki.xml wikiexporter_mediawiki_1:/var/www/html/maintenance/output.wiki.xml

docker cp ~/SimpleTooltip-master/. wikiexporter_mediawiki_1:/var/www/html/extensions/SimpleTooltip-master

docker cp ~/WikiExporter/JsonConfig/. wikiexporter_mediawiki_1:/var/www/html/extensions/JsonConfig

docker cp ~/WikiExporter/Graph/. wikiexporter_mediawiki_1:/var/www/html/extensions/Graph

docker exec wikiexporter_mediawiki_1 /bin/sh -c "cd maintenance;php importDump.php < output.wiki.xml;php rebuildrecentchanges.php;cd ..;echo 'require_once \"\$IP/extensions/SimpleTooltip-master/SimpleTooltip.php\";' >> LocalSettings.php; echo 'wfLoadExtension( 'JsonConfig' );' >> LocalSettings.php; echo 'wfLoadExtension( 'Graph' );' >> LocalSettings.php"


