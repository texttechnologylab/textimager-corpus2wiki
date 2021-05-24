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
#TODO: MAKE SYMLINKS FROM THE CORPUS2WIKI FOLDER TO /vagrant/mediawiki

