

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
node sitexml2import.js %%i markdown
rem ping 127.0.0.1 -n 2 > nul
)

echo �C���|�[�g�I��

