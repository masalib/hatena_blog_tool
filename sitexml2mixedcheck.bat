
echo �{�Ԃ̃u���O��mixed�`�F�b�N�J�n

for %%i in (tempxml/*.xml) do (
echo "%%i���ؒ�"
node sitexml2mixedcheck.js tempxml %%i >> mixed_check.csv
rem ping 127.0.0.1 -n 2 > nul
)

echo �{�Ԃ̃u���O��mixed�`�F�b�N�I��
