
SET /P ANSWER="���ؗp�̋L�����X�V�������܂��B��낵���ł����H (Y/N)?"
if /i {%ANSWER%}=={y} (goto :yes)
if /i {%ANSWER%}=={yes} (goto :yes)
if /i {%ANSWER%}=={n} (goto :no)
if /i {%ANSWER%}=={no} (goto :no)

:no
echo �������I�����܂� & pause > nul & exit

:yes

echo �X�V�J�n

for %%i in (kensyou/*.xml) do (

echo %%i >> update_kensyou.log
node sitexml2update_kensyou.js %%i >> update_kensyou.log
echo "\n" >> update_kensyou.log


rem ping 127.0.0.1 -n 2 > nul
)

echo �X�V�I��

