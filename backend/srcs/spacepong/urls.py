from django.urls import path, include
<<<<<<< HEAD
from . import views

urlpatterns = [
=======
from .views import HELLoAPI
from . import views

urlpatterns = [
        path("hello/", HELLoAPI),
>>>>>>> 390bbfae75df8f255d8512756a932f5fad670586
        path("data/", views.DataAPI.as_view()),
]