/*
The MIT License (MIT)

Copyright (c) 2017 masalib

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// モジュールの読込
var URL     = require('url');
var fs      = require('fs');
var path    = require('path');
var webclient = require("request");
var async = require('async');
var che = require('cheerio');
var client  = require('cheerio-httpcli');

if (process.argv.length < 3) {
    console.error('lack argument.');
    process.exit(1);
}


//読み込むXMLを指定
var temppath = "./" + process.argv[2] + "/" + process.argv[3];
var alternatelink;
var checkcount = 0;
var errorcount = 0;

async.series([
    function (callback) {
            fs.readFile(temppath,"utf-8",function(err,data) {
		   if (err) {
		       return console.error(err);
			process.exit(1);
		   }
		    $ = che.load(data, { decodeEntities: false });

		    $("link").each(function(i, el) {
			if ($(this).attr('rel') == 'alternate'){
				alternatelink = $(this).attr('href');
			}
		    });	
	            callback(null, "first");
        });
    },
    function (callback) {

		 client.fetch(alternatelink, {}, function( err, $, res){
		//imgリンク
		$('img').each(function () {
			if ($(this).attr('src')){
				checkcount ++;
				if ($(this).attr('src').indexOf('http:') > -1){
					console.log('mixed_check_error,' + alternatelink + ',img:src,' + $(this).attr('src'));
					errorcount ++;
				}
			}
			if ($(this).attr('srcset')){
				checkcount ++;
				if ($(this).attr('srcset').indexOf('http:') > -1){
					console.log('mixed_check_error ' + alternatelink + ' img:srcset ' + $(this).attr('src'));
					errorcount ++;
				}
			}
		})
		//iframe check
		$('iframe').each(function () {
			if ($(this).attr('src')){
				checkcount ++;
				if ($(this).attr('src').indexOf('http:') > -1){
					console.log('mixed_check_error,' + alternatelink + ',iframe:src,' + $(this).attr('src') );
					errorcount ++;
				}
			}
		})

		//script check
		$('script').each(function () {
			if ($(this).attr('src')){
				checkcount ++;
				if ($(this).attr('src').indexOf('http:') > -1){
					console.log('mixed_check_error,' + alternatelink + ',script:src,' + $(this).attr('src') );
					errorcount ++;
				}
			}
		})

		//object check
		$('object').each(function () {
			if ($(this).attr('data')){
				checkcount ++;
				if ($(this).attr('data').indexOf('http:') > -1){
					console.log('mixed_check_error,' + alternatelink + ',object:data,' + $(this).attr('src'));
					errorcount ++;
				}
			}
		})
		//form check
		$('form').each(function () {
			if ($(this).attr('action')){
				checkcount ++;
				if ($(this).attr('action').indexOf('http:') > -1){
					console.log('mixed_check_error,' + alternatelink + ',form:action,' + $(this).attr('src'));
					errorcount ++;
				}
			}
		})
		//embed check
		$('embed').each(function () {
			if ($(this).attr('src')){
				checkcount ++;
				if ($(this).attr('src').indexOf('http:') > -1){
					console.log('mixed_check_error,' + alternatelink + ',embed:src,' + $(this).attr('src'));
					errorcount ++;
				}
			}
		})
		//video check
		$('video').each(function () {
			if ($(this).attr('src')){
				checkcount ++;
				if ($(this).attr('src').indexOf('http:') > -1){
					console.log('mixed_check_error,' + alternatelink + ',video:src,' + $(this).attr('src'));
					errorcount ++;
				}
			}
		})
		//audio check
		$('audio').each(function () {
			if ($(this).attr('src')){
				checkcount ++;
				if ($(this).attr('src').indexOf('http:') > -1){
					console.log('mixed_check_error,' + alternatelink + ',audio:src,' + $(this).attr('src'));
					errorcount ++;
				}
			}
		})
		//source check
		$('source').each(function () {
			if ($(this).attr('src')){
				checkcount ++;
				if ($(this).attr('src').indexOf('http:') > -1){
					console.log('mixed_check_error,' + alternatelink + ',source:src,' + $(this).attr('src'));
					errorcount ++;
				}
			}
			if ($(this).attr('srcset')){
				checkcount ++;
				if ($(this).attr('srcset').indexOf('http:') > -1){
					console.log('mixed_check_error,' + alternatelink + ',source:srcset,' + $(this).attr('src'));
					errorcount ++;
				}
			}
		})
		//param check
		$('param').each(function () {
			if ($(this).attr('value')){
				checkcount ++;
				if ($(this).attr('value').indexOf('http:') > -1){
					console.log('mixed_check_error,' + alternatelink + ',param:value,' + $(this).attr('src'));
					errorcount ++;
				}
			}
		})
		//link check
		$('link').each(function () {
			if ($(this).attr('href')){
				checkcount ++;
				if ($(this).attr('href').indexOf('http:') > -1){
					console.log('mixed_check_error,' + alternatelink + ',link:href,' + $(this).attr('src'));
					errorcount ++;
				}
			}
		})
		callback(null, "second");
		});

    }
], function (err, results) {
    if (err) {
        throw err;
    }
    console.log('mixed_check_result,' + alternatelink + ',errorcount,' + errorcount );

});




