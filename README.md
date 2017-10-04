
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

このツールははてなブログで設定している為、モードでしかimportできません
復元（import）ツールを実行する前に、かならずモードを確認してください


## 認識しているバグ

/＞ →　＞になってしまいます
置換部分のバグだと思う・・・
be

## backup (windows OK MacOS OK)


node sitexmldownload.js

## import (windows OK MacOS not cording)


Html
import_html_mode.bat

はてな記法モード
import_hatena_mode.bat

markdownモード
import_markdown_mode.bat

