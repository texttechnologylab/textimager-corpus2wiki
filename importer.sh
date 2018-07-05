#!/bin/bash

sed -i 's/<span class="sentence">//g' maintenance/output.wiki.xml
sed -i 's/<\/span>//g' maintenance/output.wiki.xml

javac Counter.java

wait

java Counter

wait

docker cp ~/WikiExporter/maintenance/output.wiki.xml wikiexporter_mediawiki_1:/var/www/html/maintenance/output.wiki.xml

docker cp ~/WikiExporter/SimpleTooltip-master/. wikiexporter_mediawiki_1:/var/www/html/extensions/SimpleTooltip-master

docker cp ~/WikiExporter/JsonConfig/. wikiexporter_mediawiki_1:/var/www/html/extensions/JsonConfig

docker cp ~/WikiExporter/Graph/. wikiexporter_mediawiki_1:/var/www/html/extensions/Graph

docker exec wikiexporter_mediawiki_1 /bin/sh -c "cd maintenance;php importDump.php < output.wiki.xml;php rebuildrecentchanges.php;cd ..;echo 'require_once \"\$IP/extensions/SimpleTooltip/SimpleTooltip.php\";' >> LocalSettings.php; echo 'wfLoadExtension( '\''JsonConfig'\'' );' >> LocalSettings.php; echo 'wfLoadExtension( '\''Graph'\'' );' >> LocalSettings.php"


