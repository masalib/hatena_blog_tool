
SET /P ANSWER="検証用の記事を更新をかけます。よろしいですか？ (Y/N)?"
if /i {%ANSWER%}=={y} (goto :yes)
if /i {%ANSWER%}=={yes} (goto :yes)
if /i {%ANSWER%}=={n} (goto :no)
if /i {%ANSWER%}=={no} (goto :no)

:no
echo 処理を終了します & pause > nul & exit

:yes

echo 更新開始

for %%i in (kensyou/*.xml) do (

echo %%i >> update_kensyou.log
node sitexml2update_kensyou.js %%i >> update_kensyou.log
echo "\n" >> update_kensyou.log


rem ping 127.0.0.1 -n 2 > nul
)

echo 更新終了

