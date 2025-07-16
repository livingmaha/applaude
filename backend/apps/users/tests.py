from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserAuthTests(APITestCase):

    def setUp(self):
        self.register_url = reverse('user-register')
        self.login_url = reverse('user-login')
        self.user_data = {
            'email': 'testuser@applaude.ai',
            'password': 'StrongPassword123'
        }

    def test_user_registration_success(self):
        """
        Ensure we can register a new user successfully.
        """
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'testuser@applaude.ai')

    def test_user_registration_duplicate_email(self):
        """
        Ensure registration fails if the email already exists.
        """
        self.client.post(self.register_url, self.user_data, format='json') # First registration
        response = self.client.post(self.register_url, self.user_data, format='json') # Second attempt
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        """
        Ensure a registered user can log in and receive a token.
        """
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.login_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_user_login_invalid_credentials(self):
        """
        Ensure login fails with incorrect password.
        """
        self.client.post(self.register_url, self.user_data, format='json')
        invalid_data = {'email': self.user_data['email'], 'password': 'WrongPassword'}
        response = self.client.post(self.login_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('token', response.data)
