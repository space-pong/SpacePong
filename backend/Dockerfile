# Base image
FROM python:3.9-slim

# 환경변수 설정으로 Python이 버퍼링 없이 출력하도록 설정
# Python이 출력하는 데이터를 즉시 표시하게 하여 Docker 로그를 실시간으로 확인할 수 있도록 함
ENV PYTHONUNBUFFERED 1

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일을 컨테이너로 복사
COPY requirements.txt /app

# 의존성 설치
RUN pip install -r requirements.txt

# Django 서버 시작
# gunicorn = WSGI(Web Server Gateway Interface)
# WSGI는 nginx와 장고의 중간 다리 역할
# WSGI를 실행시키는 것이, Django 서버 시작과 같음
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
