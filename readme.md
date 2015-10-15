# Bowie Pixel
## Overview
Live project: [projects.acmi.net.au/bowiepixel](http://projects.acmi.net.au/bowiepixel)
> Bowie Pixel is an interactive portrait, made up of hundreds of #BowieACMI Instagram photos, dynamically collected and displayed in the guise of Bowie's alter ego, Aladdin Sane.

This project consists of three main parts:
-   `jsongenerator.php` (the script sends GET requests to the Instagram API to return data based on Instagram Keyword / Hashtag)
-   `retrievejson.php` (a script to only perform the API requests if it hasn't already been done that day, and cache the results to disk)
-   `index.php` (a single-page web app to view the Instagram images)
    - `assets/bowiepixel.js` (where the magic happens — thumbnail images are loaded, processed and displayed in a pixel mosiac)

## Slightly more detail

Based on Instagram Keyword (hashtag), this project performs a series of calls to the Instagram API and returns a JSON encoded array of un-paginated data, up to a hard-coded limit of 52 API calls. The pixel image size is restricted to 32x32, for a maximum of 1024 images.

The main web app `index.php` loads this data through an AJAX request to `retrievejson.php` which in-turn either requests new data via `jsongenerator.php` or sends through a cached version stored in the `/json` directory, if there is already data from the date of the request.

There are some peculiarities to how this was designed, so that the `jsongenerator.php` script could potentially sit on a different server to the front-end web app. If you choose to do this, you'll just need to link up the URLs in `retrievejson.php` to point to wherever you placed `jsongenerator.php`.

We only cache the bare essentials from the Instagram data, to keep the JSON metadata as small as possible!

Note: to comply with the Instagram API's terms of use, cached data should not be retained for longer than is necessary for the app to function. It would be good practice to set up a script on your server to clear out old cached data as soon as possible.
https://instagram.com/about/legal/terms/api/

## The web app part
The web app `assets/bowiepixel.js` loads in a source 32x32 pixel image from `assets/images/pixelimage.jpg`, draws it to a canvas and creates an array of hex colour values. The cached Instagram data is requested via an AJAX request to `retrievejson.php`, and each image is loaded to a canvas, the hex colour is applied, and the images are stored as data URLs in a whopping big array of 1024 images. Once all of these are loaded, the images are appended to a container `div` element, with a data attribute to link each image to its metadata. There are some mouse and touch event handlers so that if a user selects a pixel from the mosaic, a lightbox will pop up displaying the full resolution version. If a user clicks or touches the full resolution version, then the Instagram caption, username and link to the image on Instagram are displayed.

## Instagram data structure

To reduce file-size and make the Instagram data slightly easier to iterate over, here is how the Instagram data is transformed in `jsongenerator.php`:
``` php
$dataObject["thumbnail"] = $instaArray[$i]["data"][$j]["images"]["thumbnail"]["url"];
$dataObject["standard_resolution"] = $instaArray[$i]["data"][$j]["images"]["standard_resolution"]["url"];
$dataObject["caption_text"] = $instaArray[$i]["data"][$j]["caption"]["text"];
$dataObject["username"] = $instaArray[$i]["data"][$j]["caption"]["from"]["username"];
$dataObject["link"] = $instaArray[$i]["data"][$j]["link"];
```
## Dependencies

-   [jQuery](https://jquery.com/) (loaded via Google CDN)
-   [Hammer JS](http://hammerjs.github.io/) (minified version is included in this repo)
-   PHP Curl extension

## Setup Instructions

Before you get started, you will need to request your own [Instagram API Access Token](https://instagram.com/developer/authentication/). 

1.  Pop your Instagram API Access Token token into the variable `$instagramAccessToken` in `urldetails.php`.
2.  In `jsongenerator.php`, set `instagramKeyword` to the hashtag or keyword you'd like to use.
3.  In `index.php` you'll want to update the title, meta tags and `aboutBowiePixel` sections to all refer to your own project.
4.	Add a directory `json` for the cached Instagram data to be saved.

**Beware**: before deploying to a production server, there are some things you should know:
-   In the PHP scripts, Curl is currently set not to check peer or host. This exposes the script to MITM attacks. In a production environment, you may wish to use a CA bundle and switch over to a more secure approach.
-   Nowhere near enough validation / sanitation / escaping is being performed on the data from the Instagram API. In a production environment, these sources should not be trusted.
-   For a more secure setup, you may wish to place `urldetails.php` outside of your web root, so that no-one can steal your access token.

## License
This project is released under the [MIT License](https://tldrlegal.com/license/mit-license).
[jQuery](https://jquery.com/) and [Hammer JS](http://hammerjs.github.io/) are also released under  MIT.
