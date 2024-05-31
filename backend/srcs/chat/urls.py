from django.urls import path, re_path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("<str:room_name>/", views.spacepongroom.room),
    re_path(r'^.*$', views.index),
]