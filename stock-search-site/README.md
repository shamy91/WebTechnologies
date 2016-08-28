# WebTechnologies

This repository contains code for website and android app designed for Web Technologies course at USC.

##Stock Search website
The website allows users to search for stock details for all available stocks in real time, using the Markit-OnDemand API.
The stock details are displayed, along with a chart display of the stock rise and fall.
The results also show an interactive chart (HighChart API) that allows to see more details about the stock over different periods.
A news feed related to the search symbol is also displayed via the Google newsfeed API. (This is now deprecated, use Bing instead).

The calls to the Markit-On-Demand API are routed via a PHP server, which can be found in the PHP file. (The file was hosted separately on Google).
