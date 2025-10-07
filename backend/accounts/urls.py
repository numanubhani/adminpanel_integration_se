from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BodyPartImageViewSet, MyProfileView, register, register_user, register_contributor, login, me, add_funds

router = DefaultRouter()
router.register("body-part-images", BodyPartImageViewSet, basename="body-part-images")

urlpatterns = [
    path("register/", register),  
    path("register/user/", register_user),
    path("register/contributor/", register_contributor),
    path("login/", login),
    path("me/", me),
    path("add-funds/", add_funds),
    path("profile/me/", MyProfileView.as_view(), name="my-profile"),
    path("", include(router.urls)),   # ✅ include your DRF router endpoints
]
