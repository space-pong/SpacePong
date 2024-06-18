from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

class AliasAPIViewTest(APITestCase):
    def setUp(self):
        # Create a user and token for authentication
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.url = reverse('alias_api')  # Ensure this matches your URL configuration

    def test_post_valid_aliases(self):
        data = {
            "aliases": ["alias1", "alias2", "alias3"]
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"modified_aliases": ["alias1", "alias2", "alias3"]})

    def test_post_invalid_aliases_not_a_list(self):
        data = {
            "aliases": "alias1, alias2, alias3"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "aliases must be a list"})

    def test_post_duplicate_aliases(self):
        data = {
            "aliases": ["alias1", "alias2", "alias1", "alias2"]
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"modified_aliases": ["alias1", "alias2", "alias11", "alias21", "alias12"]})

# To run these tests, ensure you have the correct URL pattern for the AliasAPIView.
# urlpatterns = [
#     path('aliases/', AliasAPIView.as_view(), name='alias_api'),
# ]
