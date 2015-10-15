/*
bowiepixel.js

	Bowie Pixel

	Created by Andrew Serong for the Australian Centre for the Moving Image

	version: 1.0
	
	====================================================
	Overview:
	====================================================
	This project requires a 32x32 JPEG image to be present: "assets/images/pixelimage.jpg"
	A blank white image should be located: "assets/images/white.jpg"
	
	On document load, this image is drawn to a canvas and converted into hex colour values.
	Once the Instagram data is loaded from 'retrievejson.php', each image is drawn to a canvas,
	with a colour applied as a filled rectangle over the top, using the calculated hex colour value.
	This canvas image is then stored in an array as a data URL. Once all images are loaded,
	they are appended in Div rows to the main pixelImage container. A data attribute is used
	to link the processed thumbnail back to meta data, to enable click-behaviour to open up
	full resolution Instagram images.
	
	====================================================
	Limitations / scope for improvement
	====================================================
	
	Error handling has been woefully neglected through many parts of this project and could be
	improved. Additionally, the data returned by 'retrievejson.php' is trusted far too well.
	Before using this code in a production environment, care should be taken to properly
	sanitise and escape data retrieved through this code.

*/

// Define 'constant' URLs

var PIXEL_IMAGE_URL = "assets/images/pixelimage.jpg";
var PIXEL_IMAGE_DIMENSIONS = 32;

// Define global variables used throughout the pixelApp

var global_totalImages = 0;
var global_loadedImages = 0;
var global_percentLoading = 0;

var global_showCanvas = false;
var global_textureResolution = 64;

var global_targetPositionX = 2.5;
var global_targetPositionXOnMouseDown = 0;

var global_targetPositionY = -3.75;
var global_targetPositionYOnMouseDown = 0;

var global_targetPositionZ = 0;
var global_targetPositionZOnMouseDown = 0;

var global_mouseX = 0;
var global_mouseY = 0;
var global_mouseXOnMouseDown;
var global_mouseYOnMouseDown;

var global_windowHalfX = window.innerWidth / 2;
var global_windowHalfY = window.innerHeight / 2;

var global_ImageHex = [];

var global_InstagramData = {
	description: "Object to store Instagram data"
};

var global_Images_DataURL = {
	description: "Object to store processed images as Data URLs",
	images: new Array(1024)
}

var global_show_Instagram_text = false;
var global_show_aboutBowiePixel = false;
var global_aboutBowiePixel_page = 0;


function pixelApp() {
					
	// Initialise event handlers
	
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'wheel', onDocumentMouseWheel, false );
	document.addEventListener( 'touchstart', onDocumentMouseDown, false);
		
	// Initialise Touch event handlers
		
	var hammertime = new Hammer(document.getElementById("body"));
	hammertime.get('pinch').set({enable: true});
	hammertime.on('pinchmove', function(ev) {
		console.log('pinch');
		console.log(ev);
		onPinchZoom(ev);
	});
	hammertime.on('', function(ev) {
		
	});
	
	// Declare some variables for counting our data
	var imagePixelCount = 0;
	var totalY = PIXEL_IMAGE_DIMENSIONS;
	var totalX = PIXEL_IMAGE_DIMENSIONS;
	var totalPixels = totalX * totalY;

	console.log(totalY);
	console.log(totalX);
	
	// Declare some variables for our materials, objects and additional counts
	var orderedMetaData = [];
	var totalInstagramImages = 0;
		
	// Create canvas for manipulating and storing images
	var tempImage = new Image();
	var tempImages = [];
	tempImage.crossOrigin = "Anonymous";
	
	var tempImageData;

	global_totalImages = global_InstagramData.data.length;
	
	var loadedImagesIndex = 0;
	
	// Iterate over our paginated data from Instagram and store it in a one dimensional array to make it easy to work with
	for (var i=0; i<global_totalImages; i++) {
		orderedMetaData.push({
			index: i,
			thumbnail: global_InstagramData.data[i].thumbnail,
			standard_resolution: global_InstagramData.data[i].standard_resolution,
			caption_text: global_InstagramData.data[i].caption_text,
			username: global_InstagramData.data[i].username,
			link: global_InstagramData.data[i].link
		});
	}

	function updateThumbnail(dataURL, index) {
		console.log(dataURL);
		
		global_Images_DataURL.images[index] = dataURL;
		
		global_loadedImages++;
		console.log("Loaded Image:");
		console.log(global_loadedImages);
		global_percentLoading = Math.round(global_loadedImages / Math.min(totalPixels) * 100);
		$("#percentLoading").text(global_percentLoading);
		
	}
	
	function tempImageLoad(url, callback, index) {
		var img = new Image();
		//img.crossOrigin = 'Anonymous';
		img.setAttribute('crossOrigin','anonymous');
		img.onload = function(){
			var canvas = document.createElement('CANVAS');
			var ctx = canvas.getContext('2d');
			canvas.height = global_textureResolution;
			canvas.width = global_textureResolution;
			ctx.globalAlpha=1;
			ctx.drawImage(this,0,0,global_textureResolution,global_textureResolution);
			ctx.globalAlpha=0.7;
			ctx.fillStyle= "#" + global_ImageHex[index];
			ctx.fillRect(0,0,global_textureResolution,global_textureResolution);
			//var dataURL = canvas.toDataURL('image/jpeg', 1.0);
			var dataURL = canvas.toDataURL();
			canvas = null; 
			callback(dataURL, index);
		};
		img.onerror = function() {

			var canvas = document.createElement('CANVAS');
			var ctx = canvas.getContext('2d');
			canvas.height = global_textureResolution;
			canvas.width = global_textureResolution;
			ctx.globalAlpha=1;
			ctx.fillStyle="#fff";
			ctx.fillRect(0,0,global_textureResolution,global_textureResolution);
			ctx.globalAlpha=0.7;
			ctx.fillStyle= "#" + global_ImageHex[index];
			ctx.fillRect(0,0,global_textureResolution,global_textureResolution);
			//var dataURL = canvas.toDataURL('image/jpeg', 1.0);
			var dataURL = canvas.toDataURL();
			canvas = null;
			//alert("error:" + global_loadedImages);
			callback(dataURL, index);
		}
		img.src = url;
		console.log(url);
	}
	
	var tempUrl = "";
	var orderedMetaDataLength = orderedMetaData.length;
	
	// load images
	for (var i=0; i<totalPixels; i++) {
		
		if (i < orderedMetaDataLength)
			tempUrl = orderedMetaData[i].thumbnail;
		else 
			tempUrl = "assets/images/white.jpg";
		
		tempImageLoad( tempUrl, updateThumbnail, i);
	}
	
	function createObjects() {
		
		var objTempImages = [];
		imagePixelCount = 0;
		console.log("Well, we got this far!");
		for (var y=0; y<totalY; y++) {
		  $("#pixelContainer").append("<div class='rowStyle row" + y + "'>");
		  for (var x=0; x<totalX; x++) {

			console.log("Attempting to load image...");
			console.log(imagePixelCount);
			console.log(global_Images_DataURL.images[imagePixelCount]);
			
			$(".row" + y).append("<img src='" + global_Images_DataURL.images[imagePixelCount] + "' data-index='" + imagePixelCount + "'/>");

			// Proceed to next pixel
			imagePixelCount++;
			
			
		  }
		  $("#pixelContainer").append("</div>");
		}
	}

	// set starting position for camera
	var camera = {
		position: {
			x: 0,
			y: 0,
			z: 0
		}
	};
	camera.position.z = 35;
	//camera.position.y = 3.5;
	camera.position.x = 0;

	var pixWidth, pixHeight, pixZoom;
	pixWidth = 500;
	
	// main render function
	function render() {
		// request next frame
		requestAnimationFrame( render );
		
		// move camera based on user input values
		camera.position.x -= (global_targetPositionX + camera.position.x) * 0.1;
		camera.position.y += (global_targetPositionY - camera.position.y) * 0.1;
		camera.position.z -= (global_targetPositionZ) * 0.4;
		
		// set hard boundaries for camera position
		if (camera.position.z < 5) {
			camera.position.z = 5;
		}
		
		if (camera.position.x < -14.425) {
			camera.position.x = -14.425;
			global_targetPositionX = 14.425;
		}
		
		if (camera.position.x > 14.425) {
			camera.position.x = 14.425;
			global_targetPositionX = -14.425;
		}
		
		if (camera.position.y < -14.2) {
			camera.position.y = -14.2;
			global_targetPositionY = -14.2;
		}
		
		if (camera.position.y > 16.225) {
			camera.position.y = 16.225;
			global_targetPositionY = 16.225;
		}
				
		
		if (camera.position.z > 38) {
			camera.position.z = 38;
		}
		
		
		// slow down the camera position targets
		global_targetPositionZ *= 0.925;
		
		
		// update stats
		
		$("#cPosX").text(camera.position.x.toFixed(3));
		$("#cPosY").text(camera.position.y.toFixed(3));
		$("#cPosZ").text(camera.position.z.toFixed(3));
				
		$("#targetX").text(global_targetPositionX.toFixed(3));
		$("#targetY").text(global_targetPositionY.toFixed(3));
		$("#targetZ").text(global_targetPositionZ.toFixed(3));
		
		$("#topPos").text((window.innerHeight / 2) - ($('#pixelContainer').width() / 2));
		
		// show the canvas if it's hidden
		
		if (!global_showCanvas) {
			if (global_loadedImages >= totalPixels) {
				console.log("success!");
				global_showCanvas = true;
				createObjects();
		
				$("#splashScreen").fadeOut(function() {
					
					$("#pixelCanvas").show({ complete: function() {
						onWindowResize();
						$("#pixelCanvas").animate({ opacity: 1 }, 1000, function(){
							$("#hashTag").fadeIn();
						});
					}});
				});
			}
		}

		// update the scene
	
		pixWidth = ((50 - camera.position.z) / 100) * 5;
		
		$('#pixelContainer').css({
		  '-webkit-transform' 		: "translate(" + (0 - camera.position.x * 5) + "%, " + (0 + camera.position.y * 5) + "%) " + 'scale(' + pixWidth + ')',
		  '-moz-transform'    		: "translate(" + (0 - camera.position.x * 5) + "%, " + (0 + camera.position.y * 5) + "%) " + 'scale(' + pixWidth + ')',
		  '-ms-transform'     		: "translate(" + (0 - camera.position.x * 5) + "%, " + (0 + camera.position.y * 5) + "%) " + 'scale(' + pixWidth + ')',
		  '-o-transform'      		: "translate(" + (0 - camera.position.x * 5) + "%, " + (0 + camera.position.y * 5) + "%) " + 'scale(' + pixWidth + ')',
		  'transform'         		: "translate(" + (0 - camera.position.x * 5) + "%, " + (0 + camera.position.y * 5) + "%) " + 'scale(' + pixWidth + ')'
		});
		
	
	}
	
	render();
	
	// Event handlers
	
	window.addEventListener( 'resize', onWindowResize, false );
	function onWindowResize() {
		$('#pixelContainer').css({
		top: (window.innerHeight / 2) - ($('#pixelContainer').width() / Math.PI)
		});
		if (window.innerWidth >= 640) {
			$(".section2").show();
			$(".section1").show();
			global_aboutBowiePixel_page = 0;
		}
		else if (window.innerWidth < 640) {
			global_aboutBowiePixel_page = 0;
			$(".section1").show();
			$(".section2").hide();
			$("#paginateBtn").text("Next");

		}
	}
	
	var mouseDownPosition = {};
	var mouseUpPosition = {};
	
	function onDocumentMouseDown( event ) {

		event.preventDefault();
		event.stopPropagation();
		
		mouseDownPosition.x = event.clientX || event.touches[0].clientX;
		mouseDownPosition.y = event.clientY || event.touches[0].clientY;

		// Add event listeners to enable the 'drag' behaviour, and switch off this behaviour on mouseup.
		
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				
		document.addEventListener( 'touchmove', onDocumentMouseMove, false );
		document.addEventListener( 'touchend', onDocumentMouseUp, false );
		document.addEventListener( 'touchleave', onDocumentMouseOut, false );
		
		global_mouseXOnMouseDown = mouseDownPosition.x - global_windowHalfX;
		global_targetPositionXOnMouseDown = global_targetPositionX;
		
		global_mouseYOnMouseDown = mouseDownPosition.y - global_windowHalfY;
		global_targetPositionYOnMouseDown = global_targetPositionY;
		
		return false;

	}
	
	function onDocumentMouseMove( event ) {
		
		event.preventDefault();
		
		global_mouseX = (event.clientX || event.touches[0].clientX) - global_windowHalfX;
		global_targetPositionX = global_targetPositionXOnMouseDown + ( global_mouseX - global_mouseXOnMouseDown ) * 0.025;

		global_mouseY = (event.clientY || event.touches[0].clientY) - global_windowHalfY;
		global_targetPositionY = global_targetPositionYOnMouseDown + ( global_mouseY - global_mouseYOnMouseDown ) * 0.025;
		
		return false;
	}
	
	function onDocumentMouseWheel( event ) {

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;
		
		delta = -event.deltaY;
		if (event.deltaMode == 1) { // if mode is Line mode, instead of Pixel mode
			delta *= 33;
		}
		console.log(event);
		// More info on Wheel event: https://developer.mozilla.org/en-US/docs/Web/Events/wheel
		
		global_targetPositionZ = (delta * 0.8) * 0.02;

		return false;
		
	}

	function onDocumentMouseUp( event ) {
		event.preventDefault();
		event.stopPropagation();
		console.log("Mouse Up event");
		console.log(event);

		document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
		//document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

		document.removeEventListener( 'touchmove', onDocumentMouseMove, false );
		document.removeEventListener( 'touchend', onDocumentMouseUp, false );
		document.removeEventListener( 'touchleave', onDocumentMouseOut, false );
		
		mouseUpPosition.x = event.clientX || event.changedTouches[0].clientX || mouseDownPosition.x;
		mouseUpPosition.y = event.clientY || event.changedTouches[0].clientY || mouseDownPosition.y;
		
		console.log("mouseDownPosition.x " + mouseDownPosition.x);
		console.log("mouseDownPosition.y " + mouseDownPosition.y);
		console.log("mouseUpPosition.x " + mouseUpPosition.x);
		console.log("mouseUpPosition.y " + mouseUpPosition.y);

		if (event.target.className == 'link') {
			window.open(event.target.getAttribute("data-href"));
		}
		else if (event.target.className == 'paginate') {
			if (global_aboutBowiePixel_page == 0) {
				$(".section1").fadeOut(function() {
					$("#paginateBtn").text("Prev");
					$(".section2").fadeIn();			
				});
				global_aboutBowiePixel_page = 1;
			}
			else {
				$(".section2").fadeOut(function() {
					$("#paginateBtn").text("Next");
					$(".section1").fadeIn();
				});				
				global_aboutBowiePixel_page = 0;
			}
		}
		else if (global_show_aboutBowiePixel) {
			$("#aboutBowiePixel").animate({opacity: 0}, 300, function() {
				global_show_aboutBowiePixel = false;
				$(this).hide();
			});
		}
		
	
		if ( (mouseDownPosition.x == mouseUpPosition.x) && (mouseDownPosition.y == mouseUpPosition.y) ) {
			
			var imageIndex = 0;
			console.log(event);
			console.log(event.toElement);
			if ($(event.target).attr('class') == $(".lightBoxContainer").attr('class')) {
				$(".lightBoxContainer").fadeOut();
				$("#lbText").fadeOut(function() {
					$("#lbImage").fadeIn();		
				});
			}
			
			if (event.target) {
				imageIndex = $(event.target).data("index") || $(event.path[0]).data("index");
				var imageURL = imageURL || orderedMetaData[imageIndex].standard_resolution;
				var captionText = captionText || orderedMetaData[imageIndex].caption_text;
				var username = username || orderedMetaData[imageIndex].username;
				var link = link || orderedMetaData[imageIndex].link;
				if (typeof imageURL != 'undefined') {
					console.log(imageURL);
					$("#lbImage").attr("src", imageURL);
					$("#lbDescription").text(captionText);
					$("#lbUsername").text(username);
					$("#lbUsername").attr("data-href", link);
					$("#lbImage").load(function() {
						global_show_aboutBowiePixel = false;
						$("#aboutBowiePixel").fadeOut();
						$(".lightBoxContainer").fadeIn();
						global_show_Instagram_text = false;
					});
				}
			}

		}

		return false;
	}

	
	function onDocumentMouseOut( event ) {

		document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
		document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
		document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
		
		document.removeEventListener( 'touchmove', onDocumentMouseMove, false );
		document.removeEventListener( 'touchend', onDocumentMouseUp, false );
		document.removeEventListener( 'touchleave', onDocumentMouseOut, false );

	}
	
	// Touch event handlers
	
	function onPinchZoom(event, directionString) {
		
		var direction = 1;
		var scale = event.scale;
		
		if (event.scale < 1) {
			direction = -1;
			scale *= 10;
		}
		
		var zoomAmount = (scale * 1) * direction;
				
		global_targetPositionZ += (zoomAmount * 0.008);
		/*
		if ( (camera.position.z > 10 && Math.sign(zoomAmount) == 1) || (camera.position.z < 50 && Math.sign(zoomAmount) == -1) ) {
			global_targetPositionZ = (zoomAmount * 0.8) * 0.02;
		}*/		
		
	}


	// Event handlers for lightbox
	// Use event.target instead of event.toElement for IE and Firefox support
	// https://developer.mozilla.org/en-US/docs/Web/API/Event/target

	
	function lightBoxSwitch() {
		if (global_showCanvas) {
			global_show_Instagram_text = !global_show_Instagram_text;
			
			if (global_show_Instagram_text) {
				$("#lbImage").fadeOut(function(){
					$("#lbText").fadeIn();
				});
				
			}
			else {
				$("#lbText").fadeOut(function() {
					$("#lbImage").fadeIn();		
				});
			}
		}
	}
	function hashTagSwitch() {
		if (!global_show_aboutBowiePixel) {
			$("#aboutBowiePixel").show(function() {
				global_show_aboutBowiePixel = true;
				$(this).animate({opacity: 1}, 300);
			});
		}
	}
	function aboutBowiePixelSwitch() {
		$("#aboutBowiePixel").animate({opacity: 0}, 300, function() {
			global_show_aboutBowiePixel = false;
			$(this).hide();
		});
	}
	$("#lightBox").on({
		"click": lightBoxSwitch,
		"touchstart" : lightBoxSwitch
	});
	
	$("#hashTag").on({
		"click": hashTagSwitch,
		"touchstart": hashTagSwitch
	});
	
} // end pixelApp function


function buildHexColors(img) {
	var imageHexValues = [];
	var c = document.createElement("canvas");
	var ctx = c.getContext("2d");
	c.width = PIXEL_IMAGE_DIMENSIONS;
	c.height = PIXEL_IMAGE_DIMENSIONS;
	ctx.drawImage(img, 0, 0, PIXEL_IMAGE_DIMENSIONS, PIXEL_IMAGE_DIMENSIONS);
	  
	//from: http://stackoverflow.com/questions/667045/getpixel-from-html-canvas
	  
	//hex conversion from: http://jsfiddle.net/Mottie/xcqpF/1/light/
	//the code below adds a leading zero, then slice(-2) grabs the
	//last two characters. This ensures that 15 is 0f instead of f.
	//255 will still be ff as the leading zero will ignored.
	  
	var imgd = ctx.getImageData(0, 0, PIXEL_IMAGE_DIMENSIONS, PIXEL_IMAGE_DIMENSIONS);
	var pix = imgd.data;
	  
	for (var i=0; i<pix.length; i+=4) {
		imageHexValues.push( ("0" + (parseInt(pix[i])).toString(16)).slice(-2) +
			("0" + (parseInt(pix[i+1])).toString(16)).slice(-2) +
			("0" + (parseInt(pix[i+2])).toString(16)).slice(-2) );
	}
	return imageHexValues;
}

/* 

	Document Ready Function used as main Init

*/

$(document).ready(function (e) {

	$("#percentLoading").text(global_percentLoading);

	$("#splashScreen").fadeIn(function() {
		var pixelImage = new Image();
		pixelImage.src = PIXEL_IMAGE_URL;
		pixelImage.onload = function() {
			global_ImageHex = buildHexColors(pixelImage);
			console.log("Succeeded loading Pixel Image.");
			$.ajax({
				url: "retrievejson.php",
				method: "GET",
				cache: "false",
				dataType: "json",
				success: function(json) {
					global_InstagramData.data = json;
					console.log(global_InstagramData);
					}				
			}).complete(function() {
				$("#instagramLoader").fadeOut(function() {
					$("#loading").fadeIn();
				});
				console.log("Succeeded loading Instagram data.");
				pixelApp();
			}).fail(function() {
				console.log("Failed loading Instagram data.");
			});
		} // end pixelImage onload
	});
});
