from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated



def index(request):
    return render(request, "chat/index.html")


class spacepongroom:
    permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTAuthentication]
    # @login_required
    def room(request, room_name):
        authorization_header = request.headers.get('Authorization')
        # if (authorization_header):
        return render(request, "chat/login.html", {"room_name": room_name})
        # else:
        #     return render(request, "auth42/auth_error.html")