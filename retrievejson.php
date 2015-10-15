<?php

/* 

	Bowie Pixel Retrieve JSON
	-------------

	This script sends a request to:
	jsongenerator.php
	
	It then saves the output to disk, in the format:
	instaservice-20151014.json
	
	The next time this script receives a request, if the JSON file exists for today's date, it will send along that JSON file.
	If not, then it will submit another request to the URL above.
	
	This way of working ensures that we only run our JSON generator once a day, since it takes time to perform a large series of calls to the Instagram API.
	
	PHP required config settings:
	-----------------------------
	Write access to the json/ directory
	Curl extension should be enabled in php.ini
	
	Note: before deploying to a production environment, make sure to update the Curl options to use CURLOPT_SSL_VERIFYPEER and CURLOPT_SSL_VERIFYHOST.
	If you do not, then you open your app up to MITM attacks.
	
*/

date_default_timezone_set('Australia/Melbourne');

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

$jsonGeneratorUrl = "jsongenerator.php";
$instaCachePath = "json/";
$instaFileName = "instaservice-" . date("Ymd") . ".json";
// To switch this to hourly, use:
// $instaFileName = "instaservice-" . date("Ymd-H") . ".json";

function checkInstagramExists() {
	global $instaCachePath, $instaFileName;
	$exists = false;
	clearstatcache();
	if ( file_exists($instaCachePath . $instaFileName) ) {
		$exists = true;
	}
	return $exists;
}

function retrieveInstagram() {
	global $instaCachePath, $instaFileName;
	readfile($instaCachePath . $instaFileName);
}
		
function buildInstagram() {
	global $instaCachePath, $instaFileName, $jsonGeneratorUrl;
		
	$retrievedJSON = "";
		
	set_time_limit(120);
	$curl = curl_init($jsonGeneratorUrl);
	
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
	
	/*
	
	In a production environment, you'll likely want to switch CURLOPT_SSL_VERIFYPEER to true, and use a CA bundle. The settings below give a place to start...
	
	curl_setopt($curl, CURLOPT_CAINFO, getcwd() . "\assets\cacert.pem");
	curl_setopt($curl, CURLOPT_SSL_CIPHER_LIST, "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:ECDHE-RSA-DES-CBC3-SHA:ECDHE-ECDSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:DES-CBC3-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA");
	*/
	
	$retrievedJSON = curl_exec($curl);
	
	echo curl_error($curl);
		
	curl_close ($curl);

	// Save the array to a JSON file
	if ( !checkInstagramExists() ) { // perform another check now that we're ready to save to disk
		$newJSONfile = fopen($instaCachePath . $instaFileName, "w");
		fwrite($newJSONfile, $retrievedJSON);
		fclose($newJSONfile);
	}
	// output the JSON data
	echo($retrievedJSON);
}

function main() {
	if ( checkInstagramExists() ) {
		retrieveInstagram();
	}
	else {
		buildInstagram();
	}
}

main();

?>