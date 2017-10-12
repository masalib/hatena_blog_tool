
echo 検証用ブログのmixedチェック開始

for %%i in (kensyou/*.xml) do (
echo "%%i検証中"
node sitexml2mixedcheck.js kensyou %%i >> mixed_check_kensyou.csv
rem ping 127.0.0.1 -n 2 > nul
)

echo 検証用ブログのmixedチェック終了
