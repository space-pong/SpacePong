# base image
FROM nginx:latest

# ssl 인증서 발급
RUN openssl req -x509 -days 365 -nodes -newkey rsa:4096 -keyout /etc/ssl/private/nginx.key -out /etc/ssl/certs/nginx.crt -sha256 -subj "/CN=spacepong.42.kr"

# log 전달용 rsyslog 패키지 설치
RUN apt-get update && apt-get install -y rsyslog rsyslog-elasticsearch

# 호스트 OS의 Nginx 설정 파일을 컨테이너로 복사
COPY conf/nginx.conf /etc/nginx/nginx.conf

# 호스트 OS의 rsyslog 설정 파일을 컨테이너로 복사
COPY conf/rsyslog.conf /etc/rsyslog.conf

# .env 파일의 환경변수 가져오기
ARG ELASTIC_USER
ARG ELASTIC_PASSWORD

# rsyslog 추가 설정
RUN echo 'module(load="omelasticsearch")\n\
action(type="omelasticsearch"\n\
       server="http://'"${ELASTIC_USER}"':'"${ELASTIC_PASSWORD}"'@elasticsearch:9200"\n\
       serverport="9200"\n\
       template="plain-syslog"\n\
       searchIndex="spacepong-log"\n\
       )\n' >> /etc/rsyslog.conf

# init.sh 복사 및 실행 권한 추가
COPY init.sh /init.sh
RUN chmod +x /init.sh

# init.sh 실행
CMD ["/init.sh"]
