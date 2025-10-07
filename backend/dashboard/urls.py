from django.urls import path
from .views import user_dashboard, contributor_dashboard

urlpatterns = [
    path("user/", user_dashboard),
    path("contributor/", contributor_dashboard),
]

