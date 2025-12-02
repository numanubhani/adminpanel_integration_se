from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthViewSet,
    ProfileViewSet,
    BodyPartImageViewSet,
    AdminViewSet,
    DashboardViewSet,
    ContestViewSet,
    SmokeSignalViewSet,
    FavoriteImageViewSet,
    FavoriteGalleryViewSet,
    VoteViewSet,
    NotificationViewSet,
)

# Create router and register all ViewSets
router = DefaultRouter()

# Body part images
router.register("body-part-images", BodyPartImageViewSet, basename="body-part-images")

# Admin management
router.register("admin", AdminViewSet, basename="admin")

# Contest management
router.register("contests", ContestViewSet, basename="contests")

# Smoke Signals
router.register("smoke-signals", SmokeSignalViewSet, basename="smoke-signals")

# Favorite Images
router.register("favorites", FavoriteImageViewSet, basename="favorites")

# Favorite Galleries
router.register("favorite-galleries", FavoriteGalleryViewSet, basename="favorite-galleries")

# Votes
router.register("votes", VoteViewSet, basename="votes")

# Notifications
router.register("notifications", NotificationViewSet, basename="notifications")

urlpatterns = [
    # Authentication endpoints (keeping old URLs)
    path("login/", AuthViewSet.as_view({'post': 'login'}), name='login'),
    path("register/user/", AuthViewSet.as_view({'post': 'register_user'}), name='register-user'),
    path("register/contributor/", AuthViewSet.as_view({'post': 'register_contributor'}), name='register-contributor'),
    path("me/", AuthViewSet.as_view({'get': 'me'}), name='me'),
    
    # Profile endpoints (keeping old URLs)
    path("profile/me/", ProfileViewSet.as_view({'get': 'my_profile', 'put': 'update_my_profile', 'patch': 'update_my_profile'}), name='my-profile'),
    path("add-funds/", ProfileViewSet.as_view({'post': 'add_funds'}), name='add-funds'),
    
    # Contributor endpoints (keeping old URLs)
    path("contributor-metrics/", ProfileViewSet.as_view({'get': 'contributor_metrics'}), name='contributor-metrics'),
    path("contributors/", ProfileViewSet.as_view({'get': 'contributors_list'}), name='contributors-list'),
    
    # Dashboard endpoints (keeping old URLs)
    path("dashboard/stats/", DashboardViewSet.as_view({'get': 'stats'}), name='dashboard-stats'),
    path("dashboard/top-contributors/", DashboardViewSet.as_view({'get': 'top_contributors'}), name='top-contributors'),
    
    # Contest endpoints (keeping old URLs - my-contests handled by router now)
    # The my-contests endpoint is now available at: /api/accounts/contests/my-contests/
    
    # Router endpoints (includes body-part-images, admin, contests, smoke-signals)
    path("", include(router.urls)),
]
