from django.utils.translation import gettext as _
from rest_framework.response import Response
from django.views import View
from django.http import JsonResponse

class TranslationView(View):
    def get(self, request, format=None):
        word = request.GET.get('key', '')
        translations = {'key': _(word)}

        return JsonResponse(translations)