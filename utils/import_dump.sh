#!/bin/bash
if [ -f "./vagrant/import_wikidata.sh" ]; then
        echo "Dump Importer exists. Continue..."
        cd vagrant
        vagrant up
        vagrant ssh -- -t 'cd /; cd vagrant; sudo chmod +x import_wikidata.sh; ./import_wikidata.sh; exit;'
        tail -f wd_import.log
else
    echo "Dump Importer is missing. Please create dev-env using create_mw_dev-env.sh. Aborting..." 
fi


