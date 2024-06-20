from django.urls import path, include
from .views import AliasAPIView

urlpatterns = [
    path('', AliasAPIView.as_view(),),
]
