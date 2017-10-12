
echo 本番のブログのmixedチェック開始

for %%i in (tempxml/*.xml) do (
echo "%%i検証中"
node sitexml2mixedcheck.js tempxml %%i >> mixed_check.csv
rem ping 127.0.0.1 -n 2 > nul
)

echo 本番のブログのmixedチェック終了
