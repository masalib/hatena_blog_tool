
SET /P ANSWER="本番の記事に更新をかけます。本当によろしいですか？バックアップはとっていますか (Y/N)?"
if /i {%ANSWER%}=={y} (goto :yes)
if /i {%ANSWER%}=={yes} (goto :yes)
if /i {%ANSWER%}=={n} (goto :no)
if /i {%ANSWER%}=={no} (goto :no)

:no
echo 処理を終了します & pause > nul & exit

:yes

echo 更新開始

for %%i in (tempxml/*.xml) do (

echo %%i >> update_prod.log
node sitexml2update.js %%i >> update_prod.log
echo "\n" >> update_prod.log


rem ping 127.0.0.1 -n 2 > nul
)

echo 更新終了

