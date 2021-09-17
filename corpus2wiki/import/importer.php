<?php
// Importer.php, Corpus2Wiki
// (c)2018 Text Technology Lab, Goethe University Frankfurt

// Ensure that we are getting all Messages
ini_set('display_errors', '1');
error_reporting(E_ALL);

// Get parameters
// Get language setting
$default_lan = 0;
$lang = $_POST["language"];
$corpus_dir = "/var/www/html/import/corpus";
if($lang == ""){
	$lang = "en";
	$default_lan = 1;
}

// Get embedding paramteres and check if they match language
$default_emb = 0;
$mismatch_emb = 0;
if (isset($_POST['embedding'])){
	$emb = $_POST["embedding"];
}
else{	
	if($lang == "de"){
		// assign default pipeline for german language setting
		$emb = "zeit_komninos.CBOW_DE_100_NN_NE_V_ADJ";
	}
	if($lang == "en"){
		// assign default pipeline for english language setting
		$emb = "glove.6B.300d.txt_100nn_ALL";
	}
	$default_emb = 1;
} 
if (($lang == "de" && $emb == "glove.6B.300d.txt_100nn_ALL") or ($lang == "de" && $emb == "GoogleNews-vectors-negative300.bin_100nn_ALL") or ($lang == "de" && $emb == "enwiki_upos_skipgram_300_5_2017_model.txt_100nn_PROPN_NOUN_VERB_ADJ")){
	$mismatch_emb = 1;
}

if (($lang == "en" && $emb != "glove.6B.300d.txt_100nn_ALL") and ($lang == "en" && $emb != "GoogleNews-vectors-negative300.bin_100nn_ALL") and ($lang == "en" && $emb != "enwiki_upos_skipgram_300_5_2017_model.txt_100nn_PROPN_NOUN_VERB_ADJ")){
	$mismatch_emb = 1;
}

// Assign pipelines
$DEFAULT_PIPELINES = [
	"en" => "LanguageToolLemmatizer,CoreNlpPosTagger,FastTextDDCMulLemmaNoPunctPOSNoFunctionwordsWithCategoriesTextImagerService,TagMeAPIAnnotator",
	"de" => "LanguageToolSegmenter,LanguageToolLemmatizer,CoreNlpPosTagger,FastTextDDCMulLemmaNoPunctPOSNoFunctionwordsWithCategoriesTextImagerService,TagMeLocalAnnotator,MateMorphTagger",
];
if(array_key_exists($lang, $DEFAULT_PIPELINES)){
	$pipeline = $DEFAULT_PIPELINES[$lang];
}else{
	echo "<b>FATAL ERROR:</b> The language $lang is not assigned any pipeline. Process aborted.";
	exit;
}

if($mismatch_emb == 1){
	echo "FATAL ERROR: Embedding does not match language. Please reconsider. <br><br>";
	exit;
}

function liveExecuteCommand($cmd){

    while (@ ob_end_flush()); // end all output buffers if any

		echo '<div style="width:200%; font-family:Monospace; height:170px;overflow:auto;background-color:black;color:lime;">';

    $proc = popen("$cmd 2>&1 ; echo Exit status : $?", 'r');

    $live_output     = "";
    $complete_output = "";

    while (!feof($proc))
    {
        $live_output     = fread($proc, 4096);
        $complete_output = $complete_output . $live_output;
				$live_output = str_replace("\n", "<br>", $live_output);
        echo "$live_output";
        @ flush();
    }

    pclose($proc);

    // get exit status
    preg_match('/[0-9]+$/', $complete_output, $matches);

		echo '</div><br><br>';

    // return exit status and intended output
    return array (
                    'exit_status'  => intval($matches[0]),
                    'output'       => str_replace("Exit status : " . $matches[0], '', $complete_output)
                 );
}

function print_log($log){
	echo '<textarea cols="130" rows="20" style="overflow:auto;background-color:black;color:lime;">';
	print_r($log);
	echo '</textarea><br><br>';
}

// Page header
echo '<!DOCTYPE html><html lang="en" ><head><meta charset="UTF-8"><title>Corpus2Wiki Importer test</title><link rel="stylesheet" href="css/style.css"></head>';
echo '<body><div class="content"><img src="logo.png" style="border:none">';
echo '<h1>Corpus2Wiki Uploader</h1><h2>Step 2: Processing and Analyzing Files...</h2>';
echo '<b>Please note</b>: This process may take a wile... Closing this window before the process is completed will abort the import.<br>';

if($default_lan == 1){
	echo 'Warning: No language settings found. English assumed...<br><br>';
}

if($default_emb == 1){
	echo "Warning: No embedding settings found. Assuming $emb <br><br>";
}


// Initialize Progress Bar
echo '<html><style>#myProgress{ width:100%; background-color:#ddd} #myBar{width:1%;height:30px;background-color:#4CAF50;}</style></body>';
echo "<h3>Import Progress</h3>";
echo '<div id="myProgress"><div id="myBar"></div></div><br><br>';
echo '<script>
	function set_progress(prog){
		var elem = document.getElementById("myBar");
		elem.style.width = prog + "%"
	}
</script>';

// Step 0: Upload files to docker
// Count total files
$countfiles = count($_FILES['file']['name']);
echo "Upload data to Corpus2Wiki ($countfiles files)...";
// Looping all files
for($i=0;$i<$countfiles;$i++){
	$filename = $_FILES['file']['name'][$i];
	// Upload file
	move_uploaded_file($_FILES['file']['tmp_name'][$i],'/var/www/html/import/corpus/'.$filename);
	if(strpos($filename, ".zip")){
		echo "Extracting ".$filename."...";
		exec("cd /var/www/html/import/corpus; unzip -n -j ".$filename.";cd ..", $log1);
		unlink("/var/www/html/import/corpus/".$filename);
	}
}
echo "Files to process: ".(count(scandir("corpus")) - 2)."...";
echo "<b>done</b><br><script>set_progress(2);</script>";

// Step 1: Create Backup of Mediawiki
echo "Create Backup of current data...";

if(!file_exists($corpus_dir)) {
	mkdir($corpus_dir, 0777, true);
}
$backup_file = $corpus_dir . "/backup.xml";
if(file_exists($backup_file)) {
	unlink($backup_file);
}
exec("php /var/www/html/maintenance/dumpBackup.php --full > ".$backup_file, $log1);
if(file_exists($backup_file)) {
	echo "<b>done</b><br>";
} else {
	echo "<b>failed</b><br>";
	print_log($log1);
}
echo '<script>set_progress(7);</script>';

echo "Analyze Texts...";
if(file_exists("/var/www/html/import/maintenance/output.wiki.xml")){
	unlink("/var/www/html/import/maintenance/output.wiki.xml");
}
putenv("SHELL=/bin/bash");
// Step 2: Write embedding id
echo "Writing embedding id...";
liveExecuteCommand("nohup python3 /var/www/html/import/import.py '/var/www/html/import/corpus'".$emb);
echo '<script>set_progress(60);</script>';

// Step 2.1: Call Textimager
liveExecuteCommand("nohup java -Xms512m -Xmx4g -jar /var/www/html/import/textimager-CLI.jar -i '/var/www/html/import/corpus' --input-format XMI --input-language ".$lang." -output /var/www/html/import/maintenance --output-format MEDIAWIKI -p '$pipeline'");
if(file_exists("maintenance/output.wiki.xml")){
	echo "<b>done</b><br>";
} else {
	echo "<b>failed</b><br>";
	exit;
}
echo '<script>set_progress(70);</script>';


// Step 3: Prepare for import
echo "Prepare texts for Corpus2Wiki import...";
exec("sed -i 's/Ä/\&#196;/g;s/Ö/\&#214;/g;s/Ü/\&#220;/g;s/ä/\&#228;/g;s/ö/\&#246;/g;s/ü/\&#252;/g;s/ß/\&#223;/g' /var/www/html/import/maintenance/output.wiki.xml", $log3);
echo "<b>done</b><br>";
//liveExecuteCommand("javac Counter.java; wait; java Counter;wait");
echo '<script>set_progress(80);</script>';

// Step 4: Import into Mediawiki
echo "Import texts into Corpus2Wiki...";
liveExecuteCommand("php /var/www/html/maintenance/importDump.php < maintenance/output.wiki.xml");
liveExecuteCommand("php /var/www/html/maintenance/rebuildrecentchanges.php");
echo '<b>done</b><br>';
echo '<script>set_progress(95);</script>';

// Step 5: Clean up
echo "Cleaning up...";
if(file_exists("/var/www/html/import/maintenance/output.wiki.xml")){
	unlink("/var/www/html/import/maintenance/output.wiki.xml");
}
array_map('unlink', array_filter((array) glob("/var/www/html/import/corpus/*")));
echo '<b>done</b><br>';
echo '<script>set_progress(100);</script>';

// All done.
echo '<p style="color:green;"><b>Input procedure terminated</b></p>';
echo '<p>All documents that were processed sucessfully are now available in the <a href="../index.php/Special:AllPages"><b>Corpus2Wiki</b></a></p>';
?>
