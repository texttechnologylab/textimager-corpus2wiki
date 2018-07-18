#!/bin/bash 
 
java -jar textimager-CLI.jar -i $1 --input-format TXT --input-language $2 -output maintenance --output-format MEDIAWIKI -p "LanguageToolSegmenter,LanguageToolLemmatizer,StanfordPosTagger" 
 
nano importer.sh
