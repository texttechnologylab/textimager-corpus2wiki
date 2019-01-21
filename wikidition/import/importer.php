<?php
// Importer.php, Wikidition
// (c)2018 Text Technology Lab, Goethe University Frankfurt
// Authors: Alex Hunziker, Hasan

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

// tell php to automatically flush after every output
// including lines of output produced by shell commands
disable_ob();

function disable_ob() {
    // Turn off output buffering
    ini_set('output_buffering', 'off');
    // Turn off PHP output compression
    ini_set('zlib.output_compression', false);
    // Implicitly flush the buffer(s)
    ini_set('implicit_flush', true);
    ob_implicit_flush(true);
    // Clear, and turn off output buffering
    while (ob_get_level() > 0) {
        // Get the curent level
        $level = ob_get_level();
        // End the buffering
        ob_end_clean();
        // If the current level has not changed, abort
        if (ob_get_level() == $level) break;
    }
    // Disable apache output buffering/compression
    if (function_exists('apache_setenv')) {
        apache_setenv('no-gzip', '1');
        apache_setenv('dont-vary', '1');
    }
}

function print_log($log){
	echo '<textarea cols="70" rows="8" style="overflow:auto;background-color:black;color:lime;">';
	print_r($log);
	echo '</textarea><br><br>';
}	

disable_ob();

// Page header
echo '<!DOCTYPE html><html lang="en" ><head><meta charset="UTF-8"><title>Wikidition Importer</title><link rel="stylesheet" href="css/style.css"></head>';
echo '<body><div class="content"><img src="logo.png" style="border:none">';
echo '<h1>Wikidition Uploader</h1><h2>Step 2: Processing and Analyzing Files...</h2>';
echo '<b>Please note</b>: This process may take a wile... Closing this window before the process is completed will abort the import.<br><br>';

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
echo "Upload data to Wikidition...";
// Count total files
$countfiles = count($_FILES['file']['name']);
// Looping all files
for($i=0;$i<$countfiles;$i++){
	$filename = $_FILES['file']['name'][$i];
	// Upload file
	move_uploaded_file($_FILES['file']['tmp_name'][$i],'corpus/'.$filename);
} 
echo "<b>done</b><br><script>set_progress(2);</script>";

// Step 1: Create Backup of Mediawiki
echo "Create Backup of current data...";
$backup_file = "/var/www/html/import/corpus/backup.xml";
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

// Step 2: Call Textimager
echo "Analyze Texts...";
putenv("SHELL=/bin/bash");
exec("java -jar textimager-CLI.jar -i 'corpus' --input-format TXT --input-language ".$lang." -output maintenance --output-format MEDIAWIKI -p 'LanguageToolSegmenter,LanguageToolLemmatizer,StanfordPosTagger'", $log2);
if(file_exists("maintenance/output.wiki.xml")){
	echo "<b>done</b><br>";
} else {
	echo "<b>failed</b><br>";
	exit;
}
print_log($log2);
echo '<script>set_progress(60);</script>';


// Step 3: Prepare for import
echo "Prepare texts for Wikidition import...";
exec("sed -i 's/<span class=\"sentence\">//g' maintenance/output.wiki.xml", $log31);
exec("sed -i 's/<\/span>//g' maintenance/output.wiki.xml", $log32);
exec("javac Counter.java; wait; java Counter;wait", $log33);
$log3 = array_merge($log31, $log32, $log33);
echo "<b>done</b><br>";
if (!empty($playerlist)) {
     print_log($log3);
}
echo '<script>set_progress(80);</script>';

// Step 4: Import into Mediawiki
echo "Import texts into Wikidition...";
exec("php ../maintenance/importDump.php < maintenance/output.wiki.xml", $log4);
exec("php ../maintenance/rebuildrecentchanges.php", $log5);
echo '<b>done</b><br>';
print_log(array_merge($log4, $log5));
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
echo '<p>All documents that were processed sucessfully are now available in the <a href="http://localhost:8080/index.php/Special:AllPages"><b>Wikidition</b></a></p>';


?>
