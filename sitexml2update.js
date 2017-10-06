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
var wsse = require('wsse');
var async = require('async');
var che = require('cheerio');


const {HATENA_SITE_ID, HATENA_SITE_PW,HATENA_SITE_SOURCE_URL,HATENA_SITE_DIST_URL} = require('./config.json');

var token = wsse({ username: HATENA_SITE_ID, password: HATENA_SITE_PW });

if (process.argv.length < 3) {
    console.error('lack argument.');
    process.exit(1);
}

var postdata = (function(param) {return param[0];})`<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">`;

//読み込むXMLを指定
var temppath = "./tempxml/" + process.argv[2];
//console.log(temppath);

//var hatetena_mode =  process.argv[3];
//if (!(hatetena_mode == 'hatena' || hatetena_mode == 'markdown' || hatetena_mode == 'html')) {
//    console.error('mode error hatena or markdown or html entry');
//    process.exit(1);
//}


var http_request_options;
var editlink;

async.series([
    function (callback) {
            fs.readFile(temppath,"utf-8",function(err,data) {
		   if (err) {
		       return console.error(err);
			process.exit(1);
		   }
		    //summaryは「"」や「'」の閉じ忘れがあるので消す
		    data = data.replace(/<summary(.|\s)*?<\/(no)?summary>/gi, '');


	            $ = che.load(data, { decodeEntities: false });
		    $("content").each(function(i, el) {
			content = $(this).toString();
		    });	

		    $("link").each(function(i, el) {
			if ($(this).attr('rel') == 'edit'){
				editlink = $(this).attr('href');
			}
		    });	

		    //SSL化対応
			//youtube
			content = content.replace(/http\:\/\/www\.youtube/gi, 'https://www.youtube');
			content = content.replace(/http\:\/\/img\.youtube\.com/gi, 'https://img.youtube.com');

			//rakuten
			content = content.replace(/http\:\/\/thumbnail\.image\.rakuten\.co\.jp/gi, 'https://thumbnail.image.rakuten.co.jp');
			content = content.replace(/http\:\/\/hbb\.afl\.rakuten\.co\.jp/gi, 'https://hbb.afl.rakuten.co.jp');

			//Amazonアフィリエイト
			content = content.replace(/http\:\/\/ecx\.images-amazon\.com/gi, 'https://images-fe.ssl-images-amazon.com');

			//楽天アフィリエイト
			content = content.replace(/http\:\/\/hbb\.afl\.rakuten\.co\.jp/gi, 'https://hbb.afl.rakuten.co.jp');
			content = content.replace(/http\:\/\/hb\.afl\.rakuten\.co\.jp/gi, 'https://hb.afl.rakuten.co.jp');
			content = content.replace(/http\:\/\/thumbnail\.image\.rakuten\.co\.jp/gi, 'https://thumbnail.image.rakuten.co.jp');

			//A8 
			content = content.replace(/http\:\/\/px\.a8\.net/gi, 'https://px.a8.net');

			//A8の画像？ 1～25あるみたい(https://bibabosi-rizumu.com/ssl-http-https-afi-link/)
			for (var i=1 ; i<=25 ; i++){
			    var reg = new RegExp('http\:\/\/www' + i + '\.a8\.net', 'gi');
			    content = content.replace(reg, 'https://www' + i + '.a8.net');
			}		    


			//もしもアフィリエイト
			content = content.replace(/http\:\/\/c\.af\.moshimo\.com/gi, '//af.moshimo.com');
			content = content.replace(/http\:\/\/image\.moshimo\.com/gi, '//image.moshimo.com');
			content = content.replace(/http\:\/\/i\.af\.moshimo\.com/gi, '//i.moshimo.com');

			//アクセストレード
			content = content.replace(/http\:\/\/h\.accesstrade\.net/gi, 'https://h.accesstrade.net');

			//忍者系  『忍者AdMax』,『忍者アクセス解析』,『忍者カウンター』,『忍者おまとめボタン』,『忍者翻訳』,『忍者アクセスランキング』 http://www.ninja.co.jp/information/all_category/10973/
			content = content.replace(/http\:\/\/admax\.shinobi\.jp/gi, 'https://admax.shinobi.jp');
			content = content.replace(/http\:\/\/www\.ninja\.co\.jp\/analyze/gi, 'https://www.ninja.co.jp/analyze/');
			content = content.replace(/http\:\/\/www\.ninja\.co\.jp\/counter/gi, 'https://www.ninja.co.jp/counter/');
			content = content.replace(/http\:\/\/www\.ninja\.co\.jp\/omatome/gi, 'https://www.ninja.co.jp/omatome/');
			content = content.replace(/http\:\/\/www\.ninja\.co\.jp\/translator/gi, 'http://www.ninja.co.jp/translator');
			content = content.replace(/http\:\/\/xranking\.shinobi\.jp/gi, 'https://xranking.shinobi.jp');

			//jquery
			content = content.replace(/http\:\/\/code\.jquery\.com/gi, 'https://code.jquery.com');
			content = content.replace(/http\:\/\/ajax\.aspnetcdn\.com/gi, 'https://ajax.aspnetcdn.com');

			//パンくず
			content = content.replace(/http\:\/\/bulldra\.github\.io/gi, 'https://bulldra.github.io');

			//はてなの画像
			content = content.replace(/http\:\/\/cdn-ak\.f\.st-hatena\.com/gi, 'https://cdn-ak.f.st-hatena.com');

		    content = escape_content_html(content);

	            $ = che.load(data, { xmlMode: true });
		    var content_type = $("content").attr('type');
		    var contenttitle = $("title").text();
		    var contentauthor = $("author").text();
			//console.log(contentauthor);
		    var control_draft = $("app\\:draft").text();

	            postdata += '<title>' + escape_html(contenttitle) + '</title>';
	            postdata += '<author><name>' + escape_html(contentauthor) + '</name></author>';
	            postdata += '<content type="' + content_type  + '">';
		    postdata +=  escape_html(content) ;
	            postdata += '</content>';
		    postdata += '<updated>' + $("updated").text()  + '</updated>';
		    //カテゴリ制御
		    $("category").each(function(i, el) {
			postdata += '<category term="' + $(this).attr('term') + '"/>';
		    });	
		    //表示制御
		    postdata += '<app:control><app:draft>' + control_draft  + '</app:draft></app:control></entry>';
		    //console.log(postdata);
		    //process.exit(1);

			headers ={
			    "content-type": "application/x.atom+xml",
			    "X-WSSE": token.getWSSEHeader({ nonceBase64: true }),
			  };

			http_request_options = {
			  url: editlink ,
			  method: 'PUT',
			  headers: headers,
			  body: postdata
			}
	            callback(null, "first");
        });
    },
    function (callback) {
		webclient(http_request_options, function (error, response, body) {
			if (response.statusCode == '200' || response.statusCode == '201') {
			    callback(null, "second")
			} else {
			    //エラー処理
			    callback(body + "error :" + process.argv[2] , "second")
			    console.log(body);
			}

		})
    }
], function (err, results) {
    if (err) {
        throw err;
    }
    console.log('prod update  ' + process.argv[2]);
});



function escape_html (string) {
  if(typeof string !== 'string') {
    return string;
  }
  return string.replace(/[&'`"<>]/g, function(match) {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
    }[match]
  });
}

function escape_content_html (string) {
  if(typeof string !== 'string') {
    return string;
  }
//正規表現ではありませんの１回のみリプレースです
  string = string.replace( '<content type="text/x-hatena-syntax">' , '') ;
  string = string.replace( '<content type="text/html">' , '') ;
  string = string.replace( '<content type="text/x-markdown">' , '') ;
  string = string.replace( '</content>' , '') ;
  return string;
}