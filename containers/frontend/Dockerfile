# base image
FROM nginx:latest

# ssl 인증서 발급
RUN openssl req -x509 -days 365 -nodes -newkey rsa:4096 -keyout /etc/ssl/private/nginx.key -out /etc/ssl/certs/nginx.crt -sha256 -subj "/CN=spacepong.42.kr"

# 호스트 OS의 Nginx 설정 파일을 컨테이너로 복사
COPY conf/nginx.conf /etc/nginx/nginx.conf

# html, css, javascript 파일을 컨테이너로 복사
COPY srcs/ /var/www/html/

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
