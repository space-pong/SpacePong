from django.conf import settings
from django.shortcuts import redirect
from django.views import View
from django.http import HttpResponse
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError  
from django.contrib.auth.models import User
import http.client
import json
from urllib.parse import urlencode
from .serializers import TokenSerializer
from django.http import JsonResponse

class Auth42LoginView(View):
    def get(self, request):
        authorization_url = f"https://api.intra.42.fr/oauth/authorize?client_id={settings.API42_UID}&redirect_uri={settings.API42_REDIRECT_URI}&response_type=code"
        return redirect(authorization_url)

class Auth42CallbackView(View):
    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return HttpResponse("No authorization code provided.", status=400)
        
        token_url = 'api.intra.42.fr'
        token_path = '/oauth/token'
        token_data = urlencode({
            'grant_type': 'authorization_code',
            'client_id': settings.API42_UID,
            'client_secret': settings.API42_SECRET,
            'code': code,
            'redirect_uri': settings.API42_REDIRECT_URI,
        })
        
        conn = http.client.HTTPSConnection(token_url)
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        conn.request('POST', token_path, body=token_data, headers=headers)
        token_response = conn.getresponse()
        
        if token_response.status != 200:
            return HttpResponse("Failed to obtain access token.", status=400)

        token_json = json.loads(token_response.read().decode())
        access_token = token_json.get('access_token')
        if not access_token:
            return HttpResponse("Failed to obtain access token.", status=400)

        user_info_url = 'api.intra.42.fr'
        user_info_path = '/v2/me'
        conn.request('GET', user_info_path, headers={'Authorization': f'Bearer {access_token}'})
        user_info_response = conn.getresponse()
        
        if user_info_response.status != 200:
            return HttpResponse("Failed to obtain user info.", status=400)

        user_info_json = json.loads(user_info_response.read().decode())
        username = user_info_json.get('login')
        email = user_info_json.get('email')
        if not username or not email:
            return HttpResponse("Failed to obtain user info.", status=400)

        user, created = User.objects.get_or_create(username=username, defaults={'email': email})
        login(request, user)

        refresh = RefreshToken.for_user(user)
        response_data = {
            'access_token': str(refresh.access_token),
            'intra_id': str(username),
        }
        response = JsonResponse(response_data)
        response.set_cookie('refresh_token', str(refresh), httponly=True)
        return response

class VerifyAccessTokenView(View):
    def get(self, request):
        access_token = request.GET.get('access_token')
        if not access_token:
            return JsonResponse({'error': 'No authorization access_token provided.'}, status=400)

        try:
            access_token = AccessToken(access_token)
            access_token.verify()
            return JsonResponse({'message': 'Access token is valid'}, status=200)
        except TokenError as e:
            try:
                refresh_token = request.COOKIES.get('refresh_token')
                if not refresh_token:
                    raise TokenError('Refresh token is required')

                refresh_token = RefreshToken(refresh_token)
                access_token = str(refresh_token.access_token)
                new_refresh_token = str(refresh_token)
                response_data = {
                    'access_token': str(access_token),
                }
                response = JsonResponse(response_data)
                response.set_cookie('refresh_token', str(new_refresh_token), httponly=True)
                return response
            except TokenError as e:
                return JsonResponse({'error': str(e)}, status=401)

