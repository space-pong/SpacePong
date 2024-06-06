#!/bin/bash

# rsyslogd 직접 실행
rsyslogd

# nginx 실행
nginx -g 'daemon off;'
