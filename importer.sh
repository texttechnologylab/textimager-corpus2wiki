#!/bin/bash

sed -i 's/<span class="sentence">//g' /home/eleanor/textimager-client/target/output/output.wiki.xml
sed -i 's/<\/span>//g' /home/eleanor/textimager-client/target/output/output.wiki.xml

docker cp /home/eleanor/textimager-client/target/output/output.wiki.xml wikiexporter_mediawiki_1:/var/www/html/maintenance/output.wiki.xml

docker cp /home/eleanor/SimpleTooltip-master/. wikiexporter_mediawiki_1:/var/www/html/extensions/SimpleTooltip-master

docker exec wikiexporter_mediawiki_1 /bin/sh -c "cd maintenance;php importDump.php < output.wiki.xml;php rebuildrecentchanges.php;cd ..;echo 'require_once \"\$IP/extensions/SimpleTooltip-master/SimpleTooltip.php\";' >> LocalSettings.php"






