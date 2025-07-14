from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import CustomUser
from .models import Project

class ProjectAPITests(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='testpassword123')
        self.client.force_authenticate(user=self.user)
        
        # URL for creating and listing projects
        self.list_create_url = reverse('project-list-create')
        
    def test_create_project_form_mode(self):
        """
        Ensure we can create a new project using the form-based method.
        """
        data = {
            'name': 'My Test App',
            'source_url': 'https://example.com',
            'app_type': 'ANDROID',
            'supported_languages': '["en", "fr"]' # Sent as a JSON string
        }
        response = self.client.post(self.list_create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 1)
        project = Project.objects.get()
        self.assertEqual(project.name, 'My Test App')
        self.assertEqual(project.owner, self.user)
        self.assertEqual(project.supported_languages, ["en", "fr"])

    def test_create_project_zero_touch_mode(self):
        """
        Ensure we can create a new project using the zero-touch AI method.
        """
        prompt = "Build a simple app for my bakery."
        data = {
            'initial_prompt': prompt,
            'supported_languages': '["en"]'
        }
        response = self.client.post(self.list_create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 1)
        project = Project.objects.get()
        self.assertEqual(project.initial_prompt, prompt)
        self.assertTrue(project.name.startswith('App from prompt:'))

    def test_list_projects(self):
        """
        Ensure we can list the projects for the authenticated user.
        """
        Project.objects.create(owner=self.user, name='Project 1', source_url='http://p1.com', app_type='IOS')
        Project.objects.create(owner=self.user, name='Project 2', source_url='http://p2.com', app_type='ANDROID')
        
        # Create a project for another user that should not be listed
        other_user = CustomUser.objects.create_user(username='otheruser', password='password')
        Project.objects.create(owner=other_user, name='Other Project', source_url='http://p3.com', app_type='BOTH')

        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], 'Project 2') # Ordered by creation date descending
        self.assertEqual(response.data[1]['name'], 'Project 1')

    def test_unauthenticated_access(self):
        """
        Ensure unauthenticated users cannot access project endpoints.
        """
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
