
SET /P ANSWER="�{�Ԃ̋L���ɍX�V�������܂��B�{���ɂ�낵���ł����H�o�b�N�A�b�v�͂Ƃ��Ă��܂��� (Y/N)?"
if /i {%ANSWER%}=={y} (goto :yes)
if /i {%ANSWER%}=={yes} (goto :yes)
if /i {%ANSWER%}=={n} (goto :no)
if /i {%ANSWER%}=={no} (goto :no)

:no
echo �������I�����܂� & pause > nul & exit

:yes

echo �X�V�J�n

for %%i in (tempxml/*.xml) do (

echo %%i >> update_prod.log
node sitexml2update.js %%i >> update_prod.log
echo "\n" >> update_prod.log


rem ping 127.0.0.1 -n 2 > nul
)

echo �X�V�I��

