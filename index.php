<?php
  //set headers to NOT cache a page
  header("Cache-Control: no-cache, must-revalidate"); //HTTP 1.1
  header("Pragma: no-cache"); //HTTP 1.0
  header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
?>

<!DOCTYPE html>

<html lang="en">

<head>

	<meta charset="utf-8" />
	<title>Bowie Pixel</title>

	<meta name="keywords" content="ACMI, David Bowie, pixel, pixels, pixel portrait, pixel mosaic, portrait, portrait mosaic, exhibitions, David Bowie is, Aladdin Sane, Federation Square, Australian Centre for the Moving Image, exhibitions, Instagram" />
	<meta name="description" content="Bowie Pixel is an interactive portrait, made up of hundreds of #BowieACMI Instagram photos, dynamically collected and displayed in the guise of Bowie's alter ego, Aladdin Sane." />
    <meta name="author" content="ACMI" />

	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />

	<!-- remove tap highlighter on IE on Windows Phone -->
	<meta name="msapplication-tap-highlight" content="no" />
	
	  <!--[if lt IE 9]>
	  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	  <![endif]-->

	<link rel="stylesheet" href="assets/bowiepixel.css?v=1.004" />
	<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,400italic,600italic" rel="stylesheet" type="text/css" />
	  
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	
	<script src="assets/hammer.min.js"></script>
	<script src="assets/bowiepixel.js?v=1.004"></script>
	
	<meta property="og:title" content="Bowie Pixel" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="http://projects.acmi.net.au/bowiepixel/" />
	<meta property="og:description" content="Bowie Pixel is an interactive portrait, made up of hundreds of #BowieACMI Instagram photos, dynamically collected and displayed in the guise of Bowie's alter ego, Aladdin Sane."/>
	<meta property="og:image" content="http://projects.acmi.net.au/bowiepixel/assets/images/bowie-pixel-og.jpg"/>
	 
</head>

<body id="body">
<article>
	<div id="splashScreen">
		<p id="instagramLoader">
		Retrieving Instagram data…
		</p>
		<p id="loading">
		Loading <span id="percentLoading"></span>%
		</p>
	</div>
	<div id="hashTag" class="hashTag">
		<p class="hashTag">#BowieACMI</p>
	</div>

	<div id="aboutBowiePixel">
		<h1>Bowie Pixel</h1>
		<div class="section1">
		<p>Squint, zoom, explore.</p>
		<p>Bowie Pixel is an interactive portrait, made up of hundreds of your <strong>#bowieACMI</strong> Instagram photos, dynamically collected and displayed in the guise of Bowie's alter ego, Aladdin Sane.</p>
		<h3>Want to take part?</h3>
		<p>Hashtag your <strong>#bowieACMI</strong> memories on Instagram to take your place within this pixel mosaic. Images are updated daily.</p>
		<h3>Get under the hood</h3>
		<p>This project is open source. Clone our code over at <span class="link" data-href="https://github.com/acmilabs" target="_blank">Github</span>.</p>
		</div>
		<div class="section2">
		<h3>Don't want your image to be displayed?</h3>
		<p>To remove your image immediately, you can <span class="link" data-href="https://help.instagram.com/289302621183285" target="_blank">delete your image on Instagram</span>. If you still want to keep your image on Instagram, then you can remove the <strong>#bowieACMI</strong> hashtag by <span class="link" data-href="https://help.instagram.com/351460621611097" target="_blank">updating the caption</span>. Please allow up to 24 hours for your image to be removed. Still having difficulty? <span class="link" data-href="http://www.acmi.net.au/about-us/contact-us">Contact us</span>.</p>
		<h3>Reporting inappropriate images</h3>
		<p>Images can be reported to Instagram as <span class="link" data-href="https://help.instagram.com/192435014247952" target="_blank">inappropriate</span>. Select an image from the portrait, then click on the expanded image to display the caption and username. Click on the username to view the image on Instagram where it can then be reported.</p>
		</div>
		<button id="paginateBtn" class="paginate">
			Next
		</button>
		<p class="copyright">Bowie Pixel &copy; 2015 <span class="link" data-href="http://www.acmi.net.au" target="_blank">Australian Centre for the Moving Image</span>. Pixel image is based on <em>Album cover shoot for Aladdin Sane, 1973</em>. Photograph by Brian Duffy © Duffy Archive.</p>
	</div>

	<div id="stats">
		<p>
		camera.position.x: <span id="cPosX"></span><br/>
		camera.position.y: <span id="cPosY"></span><br/>
		camera.position.z: <span id="cPosZ"></span><br/>
		rotation value: <span id="rotV"></span><br/>
		<br/>
		targetPositionX value: <span id="targetX"></span><br/>
		targetPositionY value: <span id="targetY"></span><br/>
		targetPositionZ value: <span id="targetZ"></span><br/>
		<br/>
		topPos value: <span id="topPos"></span><br/>
		</p>
	</div>
	<div class="lightBoxContainer">
		<div id="lightBox">
			<img id="lbImage" src="" />
			<div id="lbText">
				<p id="lbDescription">
				</p>
				<p id="lbAttribution">
					<span class="link" id="lbUsername" data-href="" target="_blank"></span>
				</p>
			</div>
		</div>
	</div>
	
	<div id="pixelCanvas">
		<div id="pixelContainer">
			
		</div>
	</div>
</article>
</body>

</html>
