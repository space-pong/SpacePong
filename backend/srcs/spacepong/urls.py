from django.urls import path, include
from .views import HELLoAPI
from . import views

urlpatterns = [
        path("hello/", HELLoAPI),
        path("data/", views.DataAPI.as_view()),
]