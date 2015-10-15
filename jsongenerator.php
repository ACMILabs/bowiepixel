<?php

/* 
	Instagram JSON Generator
	------------------------
	
	Based on Instagram Keyword (hashtag)
	
	This project performs a series of calls to the Instagram API and returns a JSON encoded array of un-paginated data, up to a hard-coded limit of 52 API calls.
	
	The goal here is to only send along the following data:
	
	thumbnail URL
	standard resolution URL
	caption_text
	username
	link
	
	We discard the rest of the data to keep our returned JSON data as small as can be!
	
	Note: to comply with the Instagram API's terms of use, cached data should not be retained for longer than is necessary for the app to function.
	https://instagram.com/about/legal/terms/api/
	
	The intention of this project is to be able to iterate over a larger chunk of un-paginated data for a simple web app, rather than being limited to pages of data.
	------------------------
	
	SETUP INSTRUCTIONS:
	------------------------
	Pop your own Instagram Access Token in urldetails.php for this to work.

*/

date_default_timezone_set('Australia/Melbourne'); 

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

// gives us $instagramAccessToken — Use this file to put in your own unique Instagram Access Token
require_once("urldetails.php");

$instagramIndex = 0;
$instagramCount = 20;
$instagramKeyword = "Bowie";

$instagramURL = "https://api.instagram.com/v1/tags/" . 
		$instagramKeyword . "/media/recent/?access_token=" . $instagramAccessToken .
		"&count=" . $instagramCount;

$instaCachePath = "json/";
$instaFileName = "instaservice-" . date("Ymd") . ".json";
// To switch this to hourly, use:
// $instaFileName = "instaservice-" . date("Ymd-H") . ".json";

function buildInstagram() {
	global $instagramIndex, $instagramCount, $instagramKeyword, $instagramURL, $instaCachePath, $instaFileName;
		
	$instaArray = Array(); // initialise array
		
	$continueRequest = true;
	$index = 0;
		
	while ($continueRequest == true && $index < 52) {

		$continueRequest = false; // assume that we're not going to do another request after this one
		
		$curl = curl_init($instagramURL);
		
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
 		
		// For security, do not use the following settings in a production environment
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
 		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
		
		/* In a production environment, you'll likely want to refer to a locally hosted PEM file.
		
		curl_setopt($curl, CURLOPT_CAINFO, getcwd() . "\cacert.pem");
		curl_setopt($curl, CURLOPT_SSL_CIPHER_LIST, "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:ECDHE-RSA-DES-CBC3-SHA:ECDHE-ECDSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:DES-CBC3-SHA:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA");
		*/
		
		$instaCall = curl_exec($curl);
		
		echo curl_error($curl);
		
		$instaArray[] = json_decode($instaCall, true);
		
		if (isset($instaArray[($index)]["pagination"]["next_url"])) {
			$instagramURL = $instaArray[($index)]["pagination"]["next_url"];
			$continueRequest = true; // we found another page, so switch to true
		}
		
		set_time_limit(25);
		unset($instaCall);
		curl_close ($curl);
		
		$index++;
	}

	// Add metadata
	//$instaArray["requestTime"] = time();
	//$instaArray["success"] = true;
	
	$instaArrayLength = Count($instaArray);
	$orderedMetaData = Array();
	
	for ($i=0; $i < $instaArrayLength; $i++) {
		$dataLength = Count($instaArray[$i]["data"]);
		for ($j=0; $j < $dataLength; $j++) {
			$dataObject = Array();
			
			$dataObject["thumbnail"] = $instaArray[$i]["data"][$j]["images"]["thumbnail"]["url"];
			$dataObject["standard_resolution"] = $instaArray[$i]["data"][$j]["images"]["standard_resolution"]["url"];
			$dataObject["caption_text"] = $instaArray[$i]["data"][$j]["caption"]["text"];
			$dataObject["username"] = $instaArray[$i]["data"][$j]["caption"]["from"]["username"];
			$dataObject["link"] = $instaArray[$i]["data"][$j]["link"];

			$orderedMetaData[] = $dataObject;
		}
	}
	
	$encodedJSON = json_encode($orderedMetaData);
	// output the JSON data
	echo($encodedJSON);
}

function main() {
	buildInstagram();
}

main();

?>