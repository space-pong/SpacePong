# base image
FROM docker.elastic.co/logstash/logstash:7.9.3

# logstash 설정 파일을 컨테이너로 복사
COPY conf/logstash.conf /usr/share/logstash/pipeline/logstash.conf
