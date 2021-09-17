#!/bin/bash

if [ -f "./corpus2wiki/word2vec/syntagmatic-de.vec" ]; then
    echo "Syntagmatic embeddings file exists. Continue..."
else 
    echo "Syntagmatic embeddings file is missing. Downloading them..." \
    && wget -q http://service.hucompute.org/embeddings/api/v1/embeddings/zeit_lemmapos_mikolov_cbow.vec/download -O ./corpus2wiki/word2vec/syntagmatic-de.vec
fi

if [ -f "./corpus2wiki/word2vec/paradigmatic-de.vec" ]; then
    echo "Paradigmatic embeddings file exists. Continue..."
else 
    echo "Paradigmatic embeddings file is missing. Downloading them..." \
    && wget -q http://service.hucompute.org/embeddings/api/v1/embeddings/zeit_lemmapos_mikolov_skip.vec/download -O ./corpus2wiki/word2vec/paradigmatic-de.vec
fi

sudo docker-compose -f stack.yml up
