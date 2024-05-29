from django.conf import settings
from django.shortcuts import redirect
from django.views import View
from django.http import HttpResponse
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError  
from django.contrib.auth.models import User
import requests
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
        
        token_url = 'https://api.intra.42.fr/oauth/token'
        token_data = {
            'grant_type': 'authorization_code',
            'client_id': settings.API42_UID,
            'client_secret': settings.API42_SECRET,
            'code': code,
            'redirect_uri': settings.API42_REDIRECT_URI,
        }
        
        token_response = requests.post(token_url, data=token_data)
        if token_response.status_code != 200:
            return HttpResponse("Failed to obtain access token.", status=400)

        token_json = token_response.json()
        access_token = token_json.get('access_token')
        if not access_token:
            return HttpResponse("Failed to obtain access token.", status=400)

        user_info_url = 'https://api.intra.42.fr/v2/me'
        user_info_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
        if user_info_response.status_code != 200:
            return HttpResponse("Failed to obtain user info.", status=400)

        user_info_json = user_info_response.json()
        username = user_info_json.get('login')
        email = user_info_json.get('email')
        if not username or not email:
            return HttpResponse("Failed to obtain user info.", status=400)

        user, created = User.objects.get_or_create(username=username, defaults={'email': email})
        login(request, user)

        refresh = RefreshToken.for_user(user)
        # token_serializer = TokenSerializer(data={'access': str(refresh.access_token)})
        # token_serializer.is_valid()
        response_data = {
            'access_token': str(refresh.access_token),
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