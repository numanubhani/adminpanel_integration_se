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
    
    # W-9 endpoint for signup (no authentication required)
    path("w9/generate-for-signup/", AuthViewSet.as_view({'post': 'generate_w9_for_signup'}), name='w9-generate-for-signup'),
    
    # Profile endpoints (keeping old URLs)
    path("profile/me/", ProfileViewSet.as_view({'get': 'my_profile', 'put': 'update_my_profile', 'patch': 'update_my_profile'}), name='my-profile'),
    path("add-funds/", ProfileViewSet.as_view({'post': 'add_funds'}), name='add-funds'),
    
    # W-9 Tax Form endpoints
    path("profile/w9/generate-unique-id/", ProfileViewSet.as_view({'post': 'generate_w9_unique_id'}), name='w9-generate-unique-id'),
    path("profile/w9/mark-completed/", ProfileViewSet.as_view({'post': 'mark_w9_completed'}), name='w9-mark-completed'),
    path("profile/w9/status/", ProfileViewSet.as_view({'get': 'get_w9_status'}), name='w9-status'),
    path("profile/w9/callback/", ProfileViewSet.as_view({'post': 'w9_callback'}), name='w9-callback'),
    
    # Yoti Identity Verification endpoints
    path("profile/yoti/create-session/", ProfileViewSet.as_view({'post': 'create_yoti_session'}), name='yoti-create-session'),
    path("profile/yoti/session/<str:session_id>/", ProfileViewSet.as_view({'get': 'get_yoti_session', 'delete': 'delete_yoti_session'}), name='yoti-session'),
    path("profile/yoti/session/<str:session_id>/result/", ProfileViewSet.as_view({'get': 'get_yoti_session_result'}), name='yoti-session-result'),
    path("profile/yoti/callback/", ProfileViewSet.as_view({'post': 'yoti_callback'}), name='yoti-callback'),
    path("profile/yoti/status/", ProfileViewSet.as_view({'get': 'get_yoti_status'}), name='yoti-status'),
    
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
