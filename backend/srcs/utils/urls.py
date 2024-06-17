from django.urls import path, include
from . import views

urlpatterns = [
    path('aliases/', views.AliasAPIView.as_view(), name='alias-api'),
]
