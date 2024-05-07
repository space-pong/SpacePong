#!/bin/bash

DATE=$(date +%Y-%m-%d)

git add .
git status

echo -n "[ yes(y) / no ]"
read VAL

if [ "$VAL" = "y" ]; then
	git commit -m "Update: $DATE"
	git push origin eoh/practice
fi