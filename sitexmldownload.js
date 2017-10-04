// モジュールの読込
var client  = require('cheerio-httpcli');
var request = require('request');
var URL     = require('url');
var fs      = require('fs');
var path    = require('path');
var che     = require('cheerio');

const {HATENA_SITE_ID, HATENA_SITE_PW,HATENA_SITE_SOURCE_URL,HATENA_SITE_DIST_URL} = require('./config.json');



//共通の設定
//階層の指定()
var LINK_LEVEL = 99;

//基準となるページURL (ブログの詳細の所からコピーするのでentryの文字列がない)
var TARGET_URL = HATENA_SITE_SOURCE_URL + "/entry";


//既出のサイトを定義する。(既出のサイトは無視をする機能があるため。)
var list       = {};

//メイン処理
downloadRec(TARGET_URL, 0);

client.set('debug', true);

//downloadRec( "a aa "+ TARGET_URL, 0); //indexOfの動作確認

//指定のurlを最大レベルlevelまでダウンロードする
function downloadRec(url, level){

   //最大レベルのチェックをする (最大レベルになるまでループさせるため)
   if (level >= LINK_LEVEL) return;

   //既出のサイトは虫をする。
   if (list[url]) return;

   //基準ページ以外なら無視をする
  //-----------------------------------------------------------
   var us  = TARGET_URL.split("/");



  //  console.log(us);  //出力::[ 'http:', '', 'nodejs.jp', 'nodejs.org_ja', 'docs', 'v0.10', 'api' ]

   us.pop();  //popメソッドを使用して、配列の最後の要素を削除します。
   //console.log(us.pop()); //出力::api

  //  console.log(us);  //出力::[ 'http:', '', 'nodejs.jp', 'nodejs.org_ja', 'docs', 'v0.10' ]

   var base = us.join("/");  //joinメソッドは配列の各要素を指定の文字列で連結し、結果の文字列を返します。
  //  console.log(base);  //出力::http://nodejs.jp/nodejs.org_ja/docs/v0.10

   if (url.indexOf(base) < 0 ) return;
  //hatenaのidとpasswordを入力する
  var user = HATENA_SITE_ID;
  var password = HATENA_SITE_PW;

  client.set('headers', {
    Authorization: 'Basic ' + new Buffer(user + ':' + password).toString('base64')
  });

 // HTMLを取得する
 client.fetch(url, {}, function( err, $, res){


   //リンクされているページを取得
   $("link").each(function(idx){

    //  タグのリンク先を得る
    var href = $(this).attr('href');
    if (!href) return; //href属性を取得できない時の処理

    //  タグのリンク先を得る
    var href = $(this).attr('href');

    if ($(this).attr('rel') == 'next'){
      //nextがある場合は次を取得する
      //console.log($(this).attr('rel'));
      //console.log($(this).attr('href'));
    } else {
      return;
    }


    // 絶対パスを相対パスに変更
    href = URL.resolve(url, href);

    //'#' 以降を無視する(a.html#aa と a.html#bb　は同じものとする)
    href = href.replace(/\#.+$/, "") //末尾の#を消す

    
    //return; //debug場合はreturnすることで７件までしか取得しない
    downloadRec(href, level + 1);
  });

   var articleId= "";
   //記事単位に保存する
   $("entry").each(function(idx){
      console.log(idx);
      //console.log($(this).text());

      $xmlall = che.load($(this));

      //console.log($xmlall(this).children('link').attr('href'));
      //console.log($xmlall(this).children('link').text());
      articleId = $xmlall(this).children('link').attr('href');
      //記事単位に保存するためにIDを取得する（内部IDっぽい）
      articleId = articleId.replace( TARGET_URL , "" ) ;
      articleId = articleId.replace( /\//g , "" ) ;  
      console.log(articleId);
      content_type = $xmlall(this).children('content').attr('type');

      updated = $xmlall(this).children('updated').text();
      updated = updated.replace( '+' , '') ;
      updated = updated.replace( ':' , '') ;
      updated = updated.replace( ':' , '') ;
      updated = updated.replace( ':' , '') ;


      if (content_type == 'text/x-hatena-syntax') {
         savepath = "./tempxml/hatena_" + updated  + ".xml"; 
      }
      if (content_type == 'text/x-markdown') {
         savepath = "./tempxml/markdown_" + updated  + ".xml"; 
      }
      if (content_type == 'text/html') {
         savepath = "./tempxml/html_" + updated  + ".xml"; 
      }

      console.log(savepath); //nodejs.jp/nodejs.org_ja/docs/v0.10/download

      //保存先のディレクトリが存在するか確認をする。
      checkSaveDir(savepath);
   
      fs.writeFileSync(savepath, '<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">' + $(this).html() +  '</feed>');
 
  
  });

});
}

//保存先のディレクトリが存在するか確認をする。
function checkSaveDir(fname){
  //ディレクトリ部分だけ取り出す
  var dir = path.dirname(fname);

  //ディレクトリを再帰的に作成する。
  var dirlist = dir.split("/");
  var p = "";
  for ( var i in dirlist ) {
    p += dirlist[i] + "/";
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  }
}