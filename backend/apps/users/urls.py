from django.urls import path
from .views import CreateUserView, CreateTokenView, ManageUserView, export_user_data, delete_user_data 

app_name = 'users'

urlpatterns = [
    path('create/', CreateUserView.as_view(), name='create'),
    path('token/', CreateTokenView.as_view(), name='token'),
    path('me/', ManageUserView.as_view(), name='me'),
    path('export-data/', export_user_data, name='export-user-data'),
    path('delete-account/', delete_user_data, name='delete-user-data'),
]
