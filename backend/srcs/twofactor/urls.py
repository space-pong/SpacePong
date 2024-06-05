from django.urls import path, include
from . import views

urlpatterns = [
        path("mail/", views.faAPI.as_view()),
]