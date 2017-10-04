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
console.log(temppath);

//ファイル存在チェック
fs.access(temppath, function (err) {
    if (err) {
        if (err.code === 'ENOENT') {
            console.log('not exists!!');
	    //存在しない場合は終了	
            process.exit(1);
        }
        else {
	    //存在しない場合は終了	
            console.error(err);
            process.exit(1);
        }
    }
    else {
        //console.log('exists!!');
    }
});


var hatetena_mode =  process.argv[3];
if (!(hatetena_mode == 'hatena' || hatetena_mode == 'markdown' || hatetena_mode == 'html')) {
    console.error('mode error hatena or markdown or html entry');
    process.exit(1);
}


var http_request_options;

async.series([
    function (callback) {
            fs.readFile(temppath,"utf-8",function(err,data) {
		    //summaryは「"」や「'」の閉じ忘れがあるので消す
		    data = data.replace(/<summary(.|\s)*?<\/(no)?summary>/gi, '');

		    //youtube SSL化
		    data = data.replace(/http\:\/\/www\.youtube/gi, 'https://www.youtube');

		    //console.log(data);
	            $ = che.load(data, { decodeEntities: false });
		    $("content").each(function(i, el) {
			content = $(this).toString();
		    });	
		    //console.log($);
		    content = escape_content_html(content);
		    //console.log(content);
		    //process.exit(1);

	            $ = che.load(data, { xmlMode: true });
		    var content_type = $("content").attr('type');
		    var contenttitle = $("title").text();
		    var contentauthor = $("author").text();
			//console.log(contentauthor);
		    var control_draft = $("app\\:draft").text();

		    //モードが違う場合はアップしない		
		    if (hatetena_mode == 'hatena' && content_type != 'text/x-hatena-syntax'){
			process.exit(1);
		    }
		    if (hatetena_mode == 'markdown' && content_type != 'text/x-markdown'){
			process.exit(1);
		    }
		    if (hatetena_mode == 'html' && content_type != 'text/html'){
			process.exit(1);
		    }


	            //console.log("file-A");
	            //console.log(content_type);
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

			header_content_type = "application/x-hatena-syntax";

			//headers ={
			//    "content-type": "application/x.atom+xml",
			//    "X-WSSE": token.getWSSEHeader({ nonceBase64: true }),
			//  };

			headers ={
			    "content-type": header_content_type,
			    "X-WSSE": token.getWSSEHeader({ nonceBase64: true }),
			  };


			http_request_options = {
			  url: HATENA_SITE_DIST_URL + '/entry',
			  method: 'POST',
			  headers: headers,
			  body: postdata
			}
		    //console.log(postdata);
	            callback(null, "first");
        });
    },
    function (callback) {
	 	//fs.readFile(temppath,"utf-8",function(err,data) {
		webclient(http_request_options, function (error, response, body) {
		  //コールバックで色々な処理
		    console.log(response);
		    //console.log(body);
		    //response内容からのエラー判定（未完）

	            callback(null, "second")
		})
    }
], function (err, results) {
    if (err) {
        throw err;
    }
    console.log('series all done. ' + process.argv[2]);
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