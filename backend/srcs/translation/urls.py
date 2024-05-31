from django.urls import path
from .views import TranslationView

urlpatterns = [
    # other paths
    path('', TranslationView.as_view(), name='get_translations'),
]
