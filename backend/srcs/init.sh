#!/bin/sh

# db 대기
sleep 10

# 데이터베이스 마이그레이션
python3 manage.py makemigrations
python3 manage.py migrate

# Django 서버 시작
<<<<<<< HEAD
exec python3 manage.py runserver 0.0.0.0:8000
=======
exec python3 manage.py runserver 0.0.0.0:8000
>>>>>>> 390bbfae75df8f255d8512756a932f5fad670586
