

echo �R�s�[�����J�n
SET /P ANSWER="�ҏW���[�h�́u�͂ĂȋL�@�v�Ȃ��Ă��܂��� (Y/N)?"
if /i {%ANSWER%}=={y} (goto :yes)
if /i {%ANSWER%}=={yes} (goto :yes)
if /i {%ANSWER%}=={n} (goto :no)
if /i {%ANSWER%}=={no} (goto :no)

:no
echo �������I�����܂� & pause > nul & exit

:yes

echo �C���|�[�g�J�n

for %%i in (tempxml/hatena_*.xml) do (

echo %%i >> import_markdown.log

node sitexml2import.js %%i markdown  >> import_markdown.log
echo "\n" >> import_markdown.log

rem ping 127.0.0.1 -n 2 > nul
)

echo �C���|�[�g�I��

