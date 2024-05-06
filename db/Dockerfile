# base image
FROM postgres:latest

# 컨테이너 내에서 실행할 초기화 스크립트 파일을 복사
COPY conf/init.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/init.sh
