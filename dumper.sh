#!/bin/bash

java -jar textimager-CLI.jar -i 'corpus' --input-format TXT --input-language en -output maintenance --output-format MEDIAWIKI -p "LanguageToolSegmenter,LanguageToolLemmatizer,StanfordPosTagger"


