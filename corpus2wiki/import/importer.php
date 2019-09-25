<?php
// Importer.php, Corpus2Wiki
// (c)2018 Text Technology Lab, Goethe University Frankfurt

// Ensure that we are getting all Messages
ini_set('display_errors', '1');
error_reporting(E_ALL);

// Get parameters
$default_lan = 0;
$lang = $_POST["language"];
if($lang == ""){
	$lang = "en";
	$default_lan = 1;
}
$DEFAULT_PIPELINES = [
	"en" => "LanguageToolSegmenter,LanguageToolLemmatizer,StanfordPosTagger,StanfordNamedEntityRecognizer,FastTextDDCMulLemmaNoPunctPOSNoFunctionwordsWithCategoriesService,MateMorphTagger",
	"de" => "LanguageToolSegmenter,LanguageToolLemmatizer,StanfordPosTagger,StanfordNamedEntityRecognizer,FastTextDDCMulLemmaNoPunctPOSNoFunctionwordsWithCategoriesService,TagMeLocalAnnotator,MateMorphTagger",
];
if(array_key_exists($lang, $DEFAULT_PIPELINES)){
	$pipeline = $DEFAULT_PIPELINES[$lang];
}else{
	echo "<b>FATAL ERROR:</b> The language $lang is not assigned any pipeline. Process aborted.";
	exit;
}

function liveExecuteCommand($cmd){

    while (@ ob_end_flush()); // end all output buffers if any

		echo '<div style="width:100%; font-family:Monospace; height:170px;overflow:auto;background-color:black;color:lime;">';

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
	echo '<textarea cols="70" rows="8" style="overflow:auto;background-color:black;color:lime;">';
	print_r($log);
	echo '</textarea><br><br>';
}

// Page header
echo '<!DOCTYPE html><html lang="en" ><head><meta charset="UTF-8"><title>Corpus2Wiki Importer</title><link rel="stylesheet" href="css/style.css"></head>';
echo '<body><div class="content"><img src="logo.png" style="border:none">';
echo '<h1>Corpus2Wiki Uploader</h1><h2>Step 2: Processing and Analyzing Files...</h2>';
echo '<b>Please note</b>: This process may take a wile... Closing this window before the process is completed will abort the import.<br>';

if($default_lan == 1){
	echo 'Warning: No language settings found. English assumed...<br><br>';
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
	move_uploaded_file($_FILES['file']['tmp_name'][$i],'corpus/'.$filename);
	if(strpos($filename, ".zip")){
		echo "Extracting ".$filename."...";
		exec("cd /var/www/html/import/corpus; unzip -n -j ".$filename.";cd ..", $log1);
		unlink("corpus/".$filename);
	}
}
echo "Files to process: ".(count(scandir("corpus")) - 2)."...";
echo "<b>done</b><br><script>set_progress(2);</script>";

// Step 1: Create Backup of Mediawiki
echo "Create Backup of current data...";
$backup_file = "import/corpus/backup.xml";
if(file_exists($backup_file)) {
	unlink($backup_file);
}
exec("php maintenance/dumpBackup.php --full > ".$backup_file, $log1);
if(file_exists($backup_file)) {
	echo "<b>done</b><br>";
} else {
	echo "<b>failed</b><br>";
	print_log($log1);
}
echo '<script>set_progress(7);</script>';

// Step 2: Call Textimager
echo "Analyze Texts...";
if(file_exists("maintainance/output.wiki.xml")){
	unlink("maintainance/output.wiki.xml");
}
putenv("SHELL=/bin/bash");
liveExecuteCommand("nohup java -Xms512m -Xmx4g -jar textimager-CLI.jar -i 'corpus' --input-format TXT --input-language ".$lang." -output maintenance --output-format MEDIAWIKI -p '$pipeline'");
if(file_exists("maintenance/output.wiki.xml")){
	echo "<b>done</b><br>";
} else {
	echo "<b>failed</b><br>";
	exit;
}
echo '<script>set_progress(60);</script>';

// Step 3: Prepare for import
echo "Prepare texts for Corpus2Wiki import...";
exec("sed -i 's/Ä/\&#196;/g;s/Ö/\&#214;/g;s/Ü/\&#220;/g;s/ä/\&#228;/g;s/ö/\&#246;/g;s/ü/\&#252;/g;s/ß/\&#223;/g' maintenance/output.wiki.xml", $log3);
echo "<b>done</b><br>";
//liveExecuteCommand("javac Counter.java; wait; java Counter;wait");
echo '<script>set_progress(80);</script>';

// Step 4: Import into Mediawiki
echo "Import texts into Corpus2Wiki...";
liveExecuteCommand("php ../maintenance/importDump.php < maintenance/output.wiki.xml");
liveExecuteCommand("php ../maintenance/rebuildrecentchanges.php");
echo '<b>done</b><br>';
echo '<script>set_progress(95);</script>';

// Step 5: Clean up
echo "Cleaning up...";
if(file_exists("maintainance/output.wiki.xml")){
	unlink("maintainance/output.wiki.xml");
}
array_map('unlink', array_filter((array) glob("corpus/*")));
echo '<b>done</b><br>';
echo '<script>set_progress(100);</script>';

// All done.
echo '<p style="color:green;"><b>Input procedure terminated</b></p>';
echo '<p>All documents that were processed sucessfully are now available in the <a href="http://localhost:8080/index.php/Special:AllPages"><b>Corpus2Wiki</b></a></p>';


?>
