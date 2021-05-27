#!/bin/bash
#Setup Mediawiki Dev environment
#Install virtualbox
sudo apt install virtualbox

#Install nfs support
sudo apt install nfs-kernel-server

#Install vagrant
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install vagrant

#Download mediawiki vagrant environment
git clone --recursive https://gerrit.wikimedia.org/r/mediawiki/vagrant
cd vagrant
./setup.sh
vagrant up

#Backup mediawiki folder in vagrant env
# cp mediawiki mediawiki.bak

# (optional, uncomment if wished) Install vscode Extension for php Debugging
# code --install-extension felixfbecker.php-debug

#Configure Mediawiki to accept the import of dumps
echo "\$wgWBRepoSettings['allowEntityImport'] = true;" >> LocalSettings.php

#Create dump-importer Script
#Taken from https://www.mediawiki.org/wiki/MediaWiki-Vagrant/de
mkdir wikidata_dumps
cat > import_wikidata.sh<<- "EOF"
#!/usr/bin/env bash
chunks=$(find wikidata_dumps -type f)
for chunk in $chunks
do
    now=$(date)
    echo "$now: started import of $chunk" >> wd_import.log
    echo "-------------------------------------------" >> wd_import.log
    bzcat $chunk | mwscript importDump.php --wiki=wikidatawiki --uploads --debug --report 10000 2>>wd_import.log
    now=$(date)
    echo "-------------------------------------------" >> wd_import.log
    echo "$now: completed import of $chunk" >> wd_import.log
    echo "===========================================" >> wd_import.log
done
EOF

#Install extensions
cd mediawiki/extensions \
&& git clone https://github.com/wikimedia/mediawiki-extensions-Graph.git Graph \
&& git clone https://github.com/wikimedia/mediawiki-extensions-JsonConfig.git JsonConfig

# Configure Mediawiki to include the extensions
cd ../..
#TODO: FIND OUT WHERE THE MAPS EXTENSION IS COMING FROM
tee -a ./LocalSettings.php << END
wfLoadExtension( 'JsonConfig' );
wfLoadExtension( 'Graph' );
//wfLoadExtension( 'Maps');
require_once "\$IP/extensions/Corpus2WikiAnnotator/Corpus2WikiAnnotator.php";
require_once "\$IP/extensions/GeoViz/GeoViz.php";
//require_once __DIR__ . '/extensions/Maps/Maps_Settings.php';

# Workaround because d3.js is not loaded properly by Resources.php
\$wgHooks['BeforePageDisplay'][] ='onBeforePageDisplay';
function onBeforePageDisplay( OutputPage &\$out, Skin &\$skin )
{
	\$script = '<script type="text/javascript" src="https://d3js.org/d3.v3.js"></script>';
	\$out->addHeadItem("d3js script", \$script);
	return true;
};
END

cd ../../corpus2wiki
#TODO: MAKE SYMLINKS FROM THE CORPUS2WIKI FOLDER TO /vagrant/mediawiki
cp -r Corpus2WikiAnnotator ../utils/vagrant/mediawiki/extensions/Corpus2WikiAnnotator/
cp -r GeoViz ../utils/vagrant/mediawiki/extensions/GeoViz/
mkdir -p ../utils/vagrant/mediawiki/resources/lib/selfmade/css
cp Resources.php ../utils/vagrant/mediawiki/resources/
cp -r d3 ../utils/vagrant/mediawiki/resources/lib/d3
cp selfmade/*.js ../utils/vagrant/mediawiki/resources/lib/selfmade/
cp selfmade/*.css ../utils/vagrant/mediawiki/resources/lib/selfmade/css/