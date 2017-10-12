
# masalib hatena blog tool App

node.js 8.x more than
not test node.js 6.x

## Usage

### 事前作業
Create an account at https://hatena.com/
(はてなのアカウントが必要)

Create backup_blog and restore blog
(バックアップ元ブログとバックアップ先ブログが必要です)

node.js install
(node.js 8.x more)

### インストール

- `git clone https://github.com/masalib/hatena_blog_tool.git hatena_blog_tool`
- `cd hatena_blog_tool`
- `npm install wsse async cheerio cheerio-httpcli --save `

Create the environment files below in `./config.json`.

#### config.json
```{
  "HATENA_SITE_ID": "hatena_account_ib",
  "HATENA_SITE_PW": "atom password",
  "HATENA_SITE_SOURCE_URL": "https://blog.hatena.ne.jp/XXhatena_account_ibXX/XXbackup_hatena_blog_domainXX/atom",
  "HATENA_SITE_DIST_URL": "https://blog.hatena.ne.jp/XXhatena_account_ibXX/XXrestore_hatena_blog_domainXX/atom"
}
```
HATENA_SITE_SOURCE_URLはバックアップしたいブログのatomのURLを指定する
HATENA_SITE_DIST_URLは検証用のブログを指定します

## 注意点

このツールははてなブログで設定している為、モードでしかimportできません<br>
復元（import）ツールを実行する前に、かならずモードを確認してください


## 認識しているバグ

/＞ →　＞になってしまいます<br>
置換部分のバグだと思う・・・




## はてなブログのバックアップ

node sitexmldownload.js<br>
直下にtempxmlというフォルダができ<br>
xmlファイルが作成されています<br>
ファイル名はcontent_type　＋　更新日時になります



## バックアップしたXMLを検証用のサイトにimportする

インポートする場合は、かならずブログの初期登録モードを確認する

- Html（見たまま）モードの場合<br>
 import_html_mode.bat
- はてな記法モードの場合<br>
   import_hatena_mode.bat
- markdownモードの場合<br>
   import_markdown_mode.bat

## 検証用のサイトをバックアップする

- node sitexmldownload_kensyou.js<br>
 kensyouというフォルダにxmlができます

## 検証用のサイトへSSLに対応したタグでUPDATEする

- kensyouというフォルダの中のxmlをもとに検証用のサイトへアップします<br>
 node sitexml2update_kensyou.js XXXXX.xml
- 一括update<br>
 update_kensyou.bat


## はてなブログ（本番）へSSLに対応したタグでUPDATEする

- tempxmlというフォルダの中のxmlをもとにはてなブログ（本番）へアップします<br>
 node sitexml2update.js  XXXXX.xml
- 一括update<br>
 update_prod.bat

## 検証用のサイトが常時SSLになっているのかチェックする

  - kensyouというフォルダの中のxmlをもとにはてなブログ（本番）が常時SSLになっているのかチェックへアップします<br>
   node sitexml2mixedcheck.js kensyou XXXXX.xml
  - 一括チェックする<br>
   sitexml2mixedcheck_kensyou.bat


## はてなブログ（本番）が常時SSLになっているのかチェックする

 - tempxmlというフォルダの中のxmlをもとにはてなブログ（本番）が常時SSLになっているのかチェックへアップします<br>
  node sitexml2mixedcheck.js tempxml XXXXX.xml
 - 一括チェックする<br>
  sitexml2mixedcheck.bat
