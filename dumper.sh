#!/bin/bash

java -jar textimager-CLI.jar -i '../src/test/resources/collectionTest2' --input-format TXT --input-language en -output output --output-format MEDIAWIKI -p "LanguageToolSegmenter,LanguageToolLemmatizer,StanfordPosTagger"




