from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.Auth42LoginView.as_view(), name='auth_login'),
    path('callback/', views.Auth42CallbackView.as_view(), name='auth_callback'),
    path('access/', views.VerifyAccessTokenView.as_view()),
]