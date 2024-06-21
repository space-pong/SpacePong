from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import datetime
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def get_content_from_line():
    file_path = os.path.join(BASE_DIR, 'otpfile.txt')
    with open(file_path, 'r') as file:
        lines = file.readlines()
        current_time = datetime.datetime.now()
        line_number = current_time.minute
        content = lines[line_number - 1].strip()  # 줄바꿈 문자 제거를 위해 strip() 메서드 사용
    return content


class faAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        OTP = request.GET.get('OTP')
        if not OTP:
            return Response("No authorization code provided.", status=400)
        SERVEROTP = get_content_from_line()
        if (OTP == SERVEROTP):
            return Response("OTP OK")
        else:
            return Response("fail")
    def post(self, request):
            # 네이버 SMTP 서버 정보
        smtp_server = 'smtp.naver.com'
        smtp_port = 587

        print ("post test!")
    # 네이버 메일 계정 정보
        email_address = os.environ['otp_email_addr']
        email_password = os.environ['otp_email_pwd'] #각자 자기 이메일 비밀번호 넣기
        #네이버메일 - 환경설정 - POP3/SMTP 사용함으로 설정

    # 이메일 내용 설정
        msg = MIMEMultipart()
        msg['From'] = email_address
        msg['To'] = request.user.email
        msg['Subject'] = 'OTP service'

    # 이메일 본문 작성
        body = get_content_from_line()
        msg.attach(MIMEText(body, 'plain'))

        try:
            # SMTP 서버에 연결
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(email_address, email_password) 

            # 이메일 전송
            server.sendmail(email_address, request.user.email, msg.as_string())
            server.quit()
            return Response("OK")
        except Exception as e:
            server.quit()
            print ("post fail!");
            return Response(e)
