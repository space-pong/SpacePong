from django.urls import path
from .views import TranslationView

urlpatterns = [
    path('', TranslationView.as_view(), name='get_translations'),
]
