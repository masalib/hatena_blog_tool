

echo コピー処理開始
SET /P ANSWER="編集モードは「はてな記法」なっていますか (Y/N)?"
if /i {%ANSWER%}=={y} (goto :yes)
if /i {%ANSWER%}=={yes} (goto :yes)
if /i {%ANSWER%}=={n} (goto :no)
if /i {%ANSWER%}=={no} (goto :no)

:no
echo 処理を終了します & pause > nul & exit

:yes

echo インポート開始

for %%i in (tempxml/hatena_*.xml) do (

echo %%i >> import_markdown.log

node sitexml2import.js %%i markdown  >> import_markdown.log
echo "\n" >> import_markdown.log

rem ping 127.0.0.1 -n 2 > nul
)

echo インポート終了

