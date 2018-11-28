#!/bin/bash


#The pages from wiki is imported with "dumpBackup.php" and is saved in xml file
docker exec wikidition /bin/sh -c "cd maintenance; php dumpBackup.php --full > dump.xml; "
#The xml file is copied in "maintenance" folder 
docker cp wikidition:/var/www/html/maintenance/dump.xml maintenance/dump.xml

#changed directory to "corpus" to save all file names in an array 
cd corpus 
for file in *
do
    array=("${array[@]}" "$file")
done

#go back 
cd ..
#go to "maintenance" folder to check if the files are already existing in our Wiki
cd maintenance
for i in "${array[@]}"
do
	echo $i
	#look fo file name in dump.xml where the names of pages are saved
	if grep -q $i dump.xml; then
	#if existing
   	echo "The file with this name is already existed in Wiki"
	else
		#go one directory back
		cd ..
		#if not copy it from corpus to corpus 2
    	cp corpus/$i corpus2/
		#back to maintenance (for corret looping)
    	cd maintenance 	
   		echo copied
	fi
done

#to run textimager-CLI.jar go back to the main directory 
cd ..

java -jar textimager-CLI.jar -i 'corpus2' --input-format TXT --input-language en -output maintenance --output-format MEDIAWIKI -p "LanguageToolSegmenter,LanguageToolLemmatizer,StanfordPosTagger"

#clear the content of corpus2  
rm -rf corpus2/*