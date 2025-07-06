from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Project

User = get_user_model()

class ProjectModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpassword123'
        )

    def test_create_project(self):
        """Test creating a project for a user."""
        project = Project.objects.create(
            owner=self.user,
            name='Test Project',
            source_url='http://example.com',
            app_type=Project.AppType.ANDROID
        )
        self.assertEqual(str(project), f"{project.name} by {self.user.username}")
        self.assertEqual(project.owner, self.user)


class ProjectAPITests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpassword123'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_project_api(self):
        """Test creating a project via the API."""
        url = '/api/projects/'
        payload = {
            'name': 'API Test Project',
            'source_url': 'http://apitest.com',
            'app_type': 'IOS'
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 1)
        self.assertEqual(Project.objects.get().name, 'API Test Project')

    def test_get_projects_list(self):
        """Test retrieving a list of projects."""
        Project.objects.create(
            owner=self.user,
            name='Test Project 1',
            source_url='http://example1.com',
            app_type=Project.AppType.ANDROID
        )
        Project.objects.create(
            owner=self.user,
            name='Test Project 2',
            source_url='http://example2.com',
            app_type=Project.AppType.IOS
        )
        url = '/api/projects/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
