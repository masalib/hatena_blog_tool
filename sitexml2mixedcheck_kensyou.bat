
echo ���ؗp�u���O��mixed�`�F�b�N�J�n

for %%i in (kensyou/*.xml) do (
echo "%%i���ؒ�"
node sitexml2mixedcheck.js kensyou %%i >> mixed_check_kensyou.csv
rem ping 127.0.0.1 -n 2 > nul
)

echo ���ؗp�u���O��mixed�`�F�b�N�I��
