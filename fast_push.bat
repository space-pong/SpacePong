@echo off
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set date=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%

git add .
git status

set /p VAL="Commit and push the changes? [yes(y) / no]: "
if "%VAL%"=="y" (
	git commit -m "Update: %date%"
	git push
)
