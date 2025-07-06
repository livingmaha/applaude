from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class UserTests(TestCase):

    def test_create_user(self):
        """Ensure we can create a new user object."""
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpassword123'
        )
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.check_password('testpassword123'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        """Ensure we can create a new superuser object."""
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            username='adminuser',
            password='adminpassword123'
        )
        self.assertEqual(admin_user.email, 'admin@example.com')
        self.assertEqual(admin_user.username, 'adminuser')
        self.assertTrue(admin_user.check_password('adminpassword123'))
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

class UserAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpassword123'
        )
        self.client.force_authenticate(user=self.user)

    def test_get_user_profile(self):
        """Test retrieving the authenticated user's profile."""
        url = '/api/users/me/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['username'], self.user.username)
