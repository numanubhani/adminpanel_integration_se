from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BodyPartImageViewSet, 
    MyProfileView, 
    register, 
    register_user, 
    register_contributor, 
    login, 
    me, 
    add_funds,
    AdminViewSet,
    ContestViewSet,
)

router = DefaultRouter()
router.register("body-part-images", BodyPartImageViewSet, basename="body-part-images")
router.register("admin", AdminViewSet, basename="admin")
router.register("contests", ContestViewSet, basename="contests")

urlpatterns = [
    # User & Contributor endpoints
    path("register/", register),  
    path("register/user/", register_user),
    path("register/contributor/", register_contributor),
    path("login/", login),
    path("me/", me),
    path("add-funds/", add_funds),
    path("profile/me/", MyProfileView.as_view(), name="my-profile"),
    
    # Router endpoints (includes body-part-images and admin)
    path("", include(router.urls)),
]
