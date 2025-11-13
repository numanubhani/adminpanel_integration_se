from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status, permissions, viewsets, decorators
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse, OpenApiParameter
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count
from django.db import IntegrityError
import os
import traceback
import json

from .models import BodyPartImage, Contest, ContestParticipant, Admin, Profile, Payment, SmokeSignal, FavoriteImage, Vote, Notification
from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    UserRegisterSerializer,
    ContributorRegisterSerializer,
    AddFundsSerializer,
    AdminSerializer,
    ContestSerializer,
    ContestDetailSerializer,
    ContestParticipantSerializer,
    SmokeSignalSerializer,
    DashboardStatsSerializer,
    BodyPartImageSerializer,
    FavoriteImageSerializer,
    AddFavoriteSerializer,
    VoteSerializer,
    CastVoteSerializer,
    NotificationSerializer,
)

# Optional: Twilio for SMS sending
try:
    from twilio.rest import Client
    TWILIO_AVAILABLE = True
except Exception:
    TWILIO_AVAILABLE = False


# ══════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ══════════════════════════════════════════════════════════════════════

def parse_height_to_inches(height_str):
    """Convert height string like '5\\'10\"' or '5 feet 10 inches' to numeric inches"""
    if not height_str:
        return None
    try:
        # Handle formats like 5'10" or 5'10
        if "'" in height_str:
            parts = height_str.replace('"', '').replace("'", ' ').split()
            feet = int(parts[0]) if parts else 0
            inches = int(parts[1]) if len(parts) > 1 else 0
            return feet * 12 + inches
        # Handle plain numbers (assume already in inches)
        return float(height_str)
    except (ValueError, IndexError):
        return None


def parse_numeric_value(value_str):
    """Parse numeric value from string, handling ranges like '6-7.5'"""
    if not value_str:
        return None
    try:
        # If it's a range, take the midpoint
        if '-' in str(value_str):
            parts = value_str.split('-')
            return (float(parts[0]) + float(parts[1])) / 2
        return float(value_str)
    except (ValueError, IndexError):
        return None


def _filter_by_range(qs, range_param: str):
    """Helper function to filter queryset by time range"""
    now = timezone.now()
    if range_param == '7d':
        since = now - timedelta(days=7)
    else:
        since = now - timedelta(hours=24)
    return qs.filter(timestamp__gte=since)


# ══════════════════════════════════════════════════════════════════════
# AUTHENTICATION VIEWSET
# ══════════════════════════════════════════════════════════════════════

class AuthViewSet(viewsets.GenericViewSet):
    """
    Authentication ViewSet for login, registration, and user management.
    All authentication-related endpoints in one place.
    """
    permission_classes = [AllowAny]
    serializer_class = ProfileSerializer
    
    @extend_schema(
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "email": {"type": "string", "format": "email"},
                    "password": {"type": "string"},
                },
                "required": ["email", "password"],
                "example": {"email": "john@example.com", "password": "secret123"},
            }
        },
        responses={
            200: OpenApiResponse(
                description="Login success",
                response=dict,
                examples=[
                    OpenApiExample(
                        "Login Success",
                        value={
                            "access": "<jwt>",
                            "refresh": "<jwt>",
                            "profile": {
                                "email": "john@example.com",
                                "username": "john@example.com",
                                "role": "user",
                                "screen_name": "",
                            },
                        },
                    )
                ],
            ),
            401: OpenApiResponse(description="Invalid credentials"),
        },
    )
    @decorators.action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        """User/Contributor login with email and password"""
        email = request.data.get("email", "").lower()
        password = request.data.get("password", "")

        # Try to find user by email or username
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            try:
                user = User.objects.get(username=email)
            except User.DoesNotExist:
                return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Simple password check
        if not check_password(password, user.password):
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "profile": ProfileSerializer(user.profile, context={'request': request}).data,
            }
        )
    
    @extend_schema(
        request=UserRegisterSerializer,
        responses={201: ProfileSerializer},
        examples=[
            OpenApiExample(
                "User Register Payload",
                value={
                    "email": "user@example.com",
                    "password": "secret123",
                    "screen_name": "user1",
                },
            )
        ],
    )
    @decorators.action(detail=False, methods=['post'], url_path='register/user')
    def register_user(self, request):
        """Register a new user account"""
        serializer = UserRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "profile": ProfileSerializer(user.profile, context={'request': request}).data,
            },
            status=status.HTTP_201_CREATED,
        )
    
    @extend_schema(
        request=ContributorRegisterSerializer,
        responses={201: ProfileSerializer},
        examples=[
            OpenApiExample(
                "Contributor Register Payload",
                value={
                    "email": "contrib@example.com",
                    "password": "secret123",
                    "screenName": "creator1",
                    "creatorPathway": "photography",
                    "firstName": "John",
                    "lastName": "Doe",
                    "phoneNumber": "+123456789",
                    "address": "123 Main St",
                    "city": "NYC",
                    "state": "NY",
                    "zipCode": "10001",
                    "country": "US",
                    "countryResidence": "US",
                    "nationality": "American",
                    "occupation": "Photographer",
                    "nameVisibility": "public",
                    "isOver18": True,
                    "bio": "Sample bio",
                    "dateOfBirth": "1990-01-01",
                    "age": 35,
                    "gender": "Male",
                    "height": "5'10\"",
                    "weight": "170",
                    "shoeSize": "10.5",
                    "skinTone": "Medium",
                    "hairColor": "Brown",
                    "bodyType": "Athletic/Average",
                    "penisLength": "6-7.5",
                },
            )
        ],
    )
    @decorators.action(detail=False, methods=['post'], url_path='register/contributor')
    def register_contributor(self, request):
        """Register a new contributor account"""
        serializer = ContributorRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "profile": ProfileSerializer(user.profile, context={'request': request}).data,
            },
            status=status.HTTP_201_CREATED,
        )
    
    @decorators.action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='me')
    def me(self, request):
        """Get current authenticated user profile"""
        return Response(ProfileSerializer(request.user.profile, context={'request': request}).data)


# ══════════════════════════════════════════════════════════════════════
# PROFILE VIEWSET
# ══════════════════════════════════════════════════════════════════════

class ProfileViewSet(viewsets.ModelViewSet):
    """
    Profile ViewSet for managing user and contributor profiles.
    Includes endpoints for profile CRUD, payment, metrics, and lists.
    """
    queryset = Profile.objects.all().select_related('user')
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter profiles based on user permissions"""
        user = self.request.user
        # Regular users can only see their own profile
        if not hasattr(user, 'profile'):
            return Profile.objects.none()
        
        # Check if user is admin
        try:
            admin = Admin.objects.get(profile__user=user)
            if admin.is_admin:
                # Admins can see all profiles
                return Profile.objects.all().select_related('user')
        except Admin.DoesNotExist:
            pass
        
        # Regular users see only their profile
        return Profile.objects.filter(user=user)
    
    @decorators.action(detail=False, methods=['get'], url_path='my-profile')
    def my_profile(self, request):
        """Get current user's profile"""
        return Response(ProfileSerializer(request.user.profile, context={'request': request}).data)
    
    @decorators.action(detail=False, methods=['put', 'patch'], url_path='update-profile')
    def update_my_profile(self, request):
        """Update current user's profile"""
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @extend_schema(
        request=AddFundsSerializer,
        responses={201: AddFundsSerializer},
        examples=[
            OpenApiExample(
                "Add Funds Payload",
                value={
                    "cardNumber": "1234567890123456",
                    "expiryDate": "12/2025",
                    "securityCode": "123",
                },
            )
        ],
    )
    @decorators.action(detail=False, methods=['post'], url_path='add-funds')
    def add_funds(self, request):
        """Add funds to user account using payment information"""
        print("Add funds request data:", request.data)
        serializer = AddFundsSerializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Create payment record with default amount
        payment = serializer.save(user=request.user, amount=0.00)

        # Simulate success
        payment.status = "completed"
        payment.save()

        return Response(
            {
                "message": "Funds added successfully",
                "payment_id": payment.id,
                "status": payment.status,
            },
            status=status.HTTP_201_CREATED,
        )
    
    @decorators.action(detail=False, methods=['get'], url_path='contributors/metrics')
    def contributor_metrics(self, request):
        """Get contributor statistics and metrics"""
        try:
            # Get all contributors
            contributors = Profile.objects.filter(role='contributor')
            
            # Calculate metrics
            total_contributors = contributors.count()
            
            # Female metrics
            female_contributors = contributors.filter(gender='Female')
            total_females = female_contributors.count()
            female_22_25 = female_contributors.filter(age__gte=22, age__lte=25).count()
            light_skin_females = female_contributors.filter(skin_tone__icontains='Light').count()
            blonde_females = female_contributors.filter(hair_color__icontains='Blonde').count()
            petite_females = female_contributors.filter(body_type='Petite').count()
            
            # General metrics
            c_cup_contributors = contributors.filter(bust_size='C').count()
            tall_slender = contributors.filter(body_type='Tall & Slender').count()
            
            # Additional metrics by gender
            male_contributors = contributors.filter(gender='Male').count()
            other_contributors = contributors.filter(gender='Other').count()
            
            return Response({
                'total_contributors': total_contributors,
                'total_females': total_females,
                'female_22_25': female_22_25,
                'light_skin_females': light_skin_females,
                'blonde_females': blonde_females,
                'petite_females': petite_females,
                'c_cup_contributors': c_cup_contributors,
                'tall_slender': tall_slender,
                'male_contributors': male_contributors,
                'other_contributors': other_contributors,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @decorators.action(detail=False, methods=['get'], url_path='contributors/list')
    def contributors_list(self, request):
        """Get all contributors with their complete profile data including body part images"""
        try:
            from django.db.models import Count, Q
            
            # Get all contributors with related data
            contributors = Profile.objects.filter(role='contributor').select_related('user')
            
            # Transform to frontend format
            contributors_data = []
            for profile in contributors:
                # Parse numeric values
                height_inches = parse_height_to_inches(profile.height)
                weight_lbs = parse_numeric_value(profile.weight)
                shoe_size = parse_numeric_value(profile.shoe_size)
                penis_inches = parse_numeric_value(profile.penis_length)
                
                # Get body part images grouped by category
                body_part_images = BodyPartImage.objects.filter(user=profile.user)
                
                # Group images by body part category
                photo_galleries = {}
                for img in body_part_images:
                    category = img.body_part
                    # Exclude "All Photos" and "Profile Picture" categories
                    if category in ['All Photos', 'Profile Picture']:
                        continue
                    
                    if category not in photo_galleries:
                        photo_galleries[category] = []
                    
                    photo_galleries[category].append({
                        'id': img.id,
                        'image_url': request.build_absolute_uri(img.image.url) if img.image else None,
                        'created_at': img.created_at.isoformat() if img.created_at else None
                    })
                
                # Calculate contest statistics
                total_contests = ContestParticipant.objects.filter(contributor=profile).count()
                
                # Count contests won (1st place) - you may need to adjust this based on your voting system
                # For now, we'll use a placeholder
                contests_won = 0  # TODO: Calculate based on vote counts/rankings
                
                # Get profile picture URL
                profile_pic_url = None
                if profile.profile_picture:
                    profile_pic_url = request.build_absolute_uri(profile.profile_picture.url)
                
                # Count total images
                total_images = body_part_images.count()
                # Count filled categories (excluding "All photos" and "Profile picture")
                filled_categories = len(photo_galleries.keys())
                
                contributor_dict = {
                    'id': profile.id,
                    'screen_name': profile.screen_name or profile.user.email,
                    'name': profile.screen_name or profile.user.email,
                    'email': profile.user.email,
                    'gender': profile.gender or 'Unknown',
                    'age': profile.age,
                    'skinTone': profile.skin_tone or '',
                    'hairColor': profile.hair_color or '',
                    'bodyType': profile.body_type or profile.female_body_type or '',
                    'profile_picture': profile_pic_url,
                    'profilePicture': profile_pic_url,
                    # Numeric values for calculations (frontend expects these)
                    'heightIn': height_inches,
                    'weightLbs': weight_lbs,
                    'shoeSize': shoe_size,
                    'penisIn': penis_inches,
                    # String values for display
                    'height': profile.height or '',
                    'weight': profile.weight or '',
                    'bustSize': profile.bust_size or '',
                    'bust_size': profile.bust_size or '',
                    'cupSize': profile.bust_size or '',
                    'penisSize': profile.penis_length or '',
                    'penisLength': profile.penis_length or '',
                    'penis_size': profile.penis_length or '',
                    'shoe_size': profile.shoe_size or '',
                    'bio': profile.bio or '',
                    'photoGalleries': f"{filled_categories} of 7",  # 7 total categories
                    'photo_galleries': f"{filled_categories} of 7",
                    'photoGallery': photo_galleries,  # Object with categories as keys
                    'created_at': profile.user.date_joined.isoformat() if profile.user.date_joined else None,
                    # Contest/earnings data
                    'contests': total_contests,
                    'contestsCount': total_contests,
                    'contests_count': total_contests,
                    'contestsWon': contests_won,
                    'badges': contests_won,  # Assuming badges = wins for now
                    'badgesCount': contests_won,
                    'badges_count': contests_won,
                    'earnings': 0,  # TODO: Calculate from contest prizes
                    'engagement': 0,  # TODO: Calculate based on views/favorites
                }
                contributors_data.append(contributor_dict)
            
            return Response({
                'count': len(contributors_data),
                'contributors': contributors_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )




# ══════════════════════════════════════════════════════════════════════
# BODY PART IMAGE VIEWSET
# ══════════════════════════════════════════════════════════════════════

class BodyPartImageViewSet(viewsets.ModelViewSet):
    """
    Body Part Image ViewSet for managing contributor body part images.
    """
    serializer_class = BodyPartImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BodyPartImage.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @decorators.action(detail=False, methods=['get'], url_path='counts')
    def image_counts(self, request):
        """
        Get count of images by category for the current user.
        Returns total images and breakdown by body part category.
        """
        user = request.user
        
        # Get all images for the user grouped by body_part
        images = BodyPartImage.objects.filter(user=user)
        
        # Count by category
        from django.db.models import Count
        category_counts = images.values('body_part').annotate(count=Count('id')).order_by('body_part')
        
        # Format response
        counts_dict = {item['body_part']: item['count'] for item in category_counts}
        total_count = images.count()
        
        return Response({
            'total': total_count,
            'by_category': counts_dict,
            'categories': list(category_counts)
        }, status=status.HTTP_200_OK)


# ══════════════════════════════════════════════════════════════════════
# ADMIN VIEWSET
# ══════════════════════════════════════════════════════════════════════

class AdminViewSet(viewsets.ModelViewSet):
    """
    Admin ViewSet with register and login actions.
    Simple admin management with email/password authentication.
    """
    queryset = Admin.objects.all().select_related('profile__user')
    serializer_class = AdminSerializer
    permission_classes = [AllowAny]  # We'll handle permissions per action
    
    @extend_schema(
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'email': {'type': 'string', 'format': 'email'},
                    'password': {'type': 'string'}
                },
                'required': ['email', 'password'],
                'example': {
                    'email': 'admin@example.com',
                    'password': 'admin123456'
                }
            }
        },
        responses={200: AdminSerializer}
    )
    @decorators.action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        """
        Admin login with email and password.
        Returns JWT tokens and admin details.
        """
        email = request.data.get('email', '').lower()
        password = request.data.get('password', '')
        
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find user (check both email and username fields)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Try username field if email field doesn't work
            try:
                user = User.objects.get(username=email)
            except User.DoesNotExist:
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        # Check password
        if not check_password(password, user.password):
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check if user has admin profile
        try:
            admin = Admin.objects.get(profile__user=user)
            if not admin.is_admin:
                return Response(
                    {'error': 'Not an admin account'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Admin.DoesNotExist:
            return Response(
                {'error': 'Not an admin account'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        try:
            admin_data = AdminSerializer(admin).data
        except Exception as e:
            # If serializer fails, return basic admin data
            admin_data = {
                'id': admin.id,
                'email': user.email,
                'screen_name': admin.profile.screen_name if hasattr(admin.profile, 'screen_name') else '',
                'is_admin': admin.is_admin,
            }
        
        return Response({
            'message': 'Login successful',
            'admin': admin_data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    
    @extend_schema(
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'email': {'type': 'string', 'format': 'email'},
                    'isAdmin': {'type': 'boolean', 'default': True}
                },
                'required': ['email'],
                'example': {
                    'email': 'contributor@example.com',
                    'isAdmin': True
                }
            }
        },
        responses={201: AdminSerializer}
    )
    @decorators.action(detail=False, methods=['post'], url_path='promote')
    def promote_contributor(self, request):
        """
        Promote an existing contributor to admin.
        Fetches contributor by email and creates admin record.
        """
        email = request.data.get('email', '').lower()
        is_admin = request.data.get('isAdmin', True)
        
        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find user by email (check both email and username fields)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Try username field if email field doesn't work
            try:
                user = User.objects.get(username=email)
            except User.DoesNotExist:
                return Response(
                    {'error': 'User with this email not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Check if user has a profile
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if already an admin
        if Admin.objects.filter(profile=profile).exists():
            return Response(
                {'error': 'User is already an admin'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create admin record
        admin = Admin.objects.create(
            profile=profile,
            is_admin=is_admin
        )
        
        return Response({
            'message': 'Contributor promoted to admin successfully',
            'admin': AdminSerializer(admin).data
        }, status=status.HTTP_201_CREATED)


# ══════════════════════════════════════════════════════════════════════
# CONTEST MANAGEMENT
# ══════════════════════════════════════════════════════════════════════

# ══════════════════════════════════════════════════════════════════════
# DASHBOARD VIEWSET
# ══════════════════════════════════════════════════════════════════════

class DashboardViewSet(viewsets.GenericViewSet):
    """
    Dashboard ViewSet for admin statistics and metrics.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = DashboardStatsSerializer
    
    @decorators.action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """Get admin dashboard statistics"""
        try:
            # Calculate date 30 days ago
            thirty_days_ago = timezone.now() - timedelta(days=30)
            
            # Total contributors and users
            total_contributors = Profile.objects.filter(role='contributor').count()
            total_users = Profile.objects.filter(role='user').count()
            
            # Recent signups (last 30 days)
            recent_contributors = Profile.objects.filter(
                role='contributor', 
                user__date_joined__gte=thirty_days_ago
            ).count()
            recent_users = Profile.objects.filter(
                role='user', 
                user__date_joined__gte=thirty_days_ago
            ).count()
            
            # Wallet deposits (total amount from completed payments)
            wallet_stats = Payment.objects.filter(
                status='completed'
            ).aggregate(
                total=Sum('amount')
            )
            total_wallet_deposits = wallet_stats['total'] or 0
            
            # Total number of payments
            total_payments = Payment.objects.filter(status='completed').count()
            
            # Active contests
            active_contests = Contest.objects.filter(is_active=True).count()
            
            stats = {
                'total_contributors': total_contributors,
                'total_users': total_users,
                'total_wallet_deposits': total_wallet_deposits,
                'total_payments': total_payments,
                'recent_contributors': recent_contributors,
                'recent_users': recent_users,
                'active_contests': active_contests,
            }
            
            serializer = DashboardStatsSerializer(stats)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @decorators.action(detail=False, methods=['get'], url_path='top-contributors')
    def top_contributors(self, request):
        """Get top contributors with their statistics"""
        try:
            # Get all contributors with their stats
            contributors = Profile.objects.filter(role='contributor').select_related('user')
            
            top_contributors_data = []
            
            for profile in contributors:
                # Get contests joined count
                contests_joined = ContestParticipant.objects.filter(
                    contributor=profile
                ).count()
                
                # Get total votes (upvotes) received across all contests
                total_votes = Vote.objects.filter(
                    participant__contributor=profile
                ).count()
                
                # Get contests won (1st place finishes)
                # For now, we count how many contests they participated in where they had the most votes
                participant_records = ContestParticipant.objects.filter(
                    contributor=profile
                ).annotate(
                    vote_count=Count('votes')
                )
                
                contests_won = 0
                top3_finishes = 0
                top10_finishes = 0
                
                for participant in participant_records:
                    contest = participant.contest
                    # Get all participants in this contest ordered by votes
                    all_participants = ContestParticipant.objects.filter(
                        contest=contest
                    ).annotate(
                        vote_count=Count('votes')
                    ).order_by('-vote_count', 'joined_at')
                    
                    # Find position
                    position = 1
                    for idx, p in enumerate(all_participants, start=1):
                        if p.id == participant.id:
                            position = idx
                            break
                    
                    if position == 1:
                        contests_won += 1
                    if position <= 3:
                        top3_finishes += 1
                    if position <= 10:
                        top10_finishes += 1
                
                # Get unique body parts (galleries completed)
                # Excluding "All Photos" and "Profile Picture" categories, so total is 7
                unique_body_parts = BodyPartImage.objects.filter(
                    user=profile.user
                ).exclude(
                    body_part__in=['All Photos', 'Profile Picture']
                ).values('body_part').distinct().count()
                
                # Total galleries available (excluding "All Photos" and "Profile Picture")
                total_galleries = 7
                galleries_completed = f"{unique_body_parts} of {total_galleries}"
                
                # Get profile picture or ID document for avatar
                avatar_url = None
                if profile.profile_picture:
                    avatar_url = request.build_absolute_uri(profile.profile_picture.url)
                elif profile.id_document:
                    avatar_url = request.build_absolute_uri(profile.id_document.url)
                
                top_contributors_data.append({
                    'id': profile.id,
                    'name': profile.screen_name or profile.legal_full_name or profile.user.username,
                    'avatar': avatar_url,
                    'contests_joined': contests_joined,
                    'votes': total_votes,
                    'contests_win': contests_won,
                    'galleries_completed': galleries_completed,
                    'top3Finishes': top3_finishes,
                    'top10Finishes': top10_finishes,
                })
            
            # Sort by total votes (descending)
            top_contributors_data.sort(key=lambda x: x['votes'], reverse=True)
            
            # Return top 20 contributors
            return Response(top_contributors_data[:20], status=status.HTTP_200_OK)
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ══════════════════════════════════════════════════════════════════════
# CUSTOM PERMISSIONS
# ══════════════════════════════════════════════════════════════════════

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission:
    - Only users with Admin profile can create, update, delete contests
    - All authenticated users can view contests
    """
    def has_permission(self, request, view):
        # Allow read-only access for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        
        # Write permissions only for admins
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Check if user has admin profile
        try:
            admin = Admin.objects.get(profile__user=request.user)
            return admin.is_admin
        except Admin.DoesNotExist:
            return False


class ContestViewSet(viewsets.ModelViewSet):
    """
    Contest ViewSet for full CRUD operations.
    
    Permissions:
    - CREATE/UPDATE/DELETE: Only users with Admin role
    - LIST/RETRIEVE: All authenticated users (users and contributors)
    
    Endpoints:
    - GET /api/accounts/contests/ - List all active contests
    - GET /api/accounts/contests/{id}/ - Get contest details
    - POST /api/accounts/contests/ - Create contest (admin only)
    - PUT/PATCH /api/accounts/contests/{id}/ - Update contest (admin only)
    - DELETE /api/accounts/contests/{id}/ - Delete contest (admin only)
    - POST /api/accounts/contests/{id}/join/ - Join contest (contributors only)
    """
    queryset = Contest.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    
    def get_serializer_class(self):
        """Use detailed serializer for single contest view"""
        if self.action == 'retrieve':
            return ContestDetailSerializer
        return ContestSerializer
    
    def get_queryset(self):
        """
        Filter contests by availability rules and other parameters.
        Only show contests that are available for joining based on advance availability rules.
        """
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        
        # Start with base queryset
        queryset = Contest.objects.filter(is_active=True)
        
        # Check if this is an admin request (show all contests for admin)
        try:
            admin = Admin.objects.get(profile__user=self.request.user)
            is_admin_user = admin.is_admin
        except Admin.DoesNotExist:
            is_admin_user = False
        
        if is_admin_user:
            # Admin can see all contests, including templates
            queryset = Contest.objects.all()
        else:
            # For regular users and contributors, apply availability rules
            # Exclude recurring templates (they're not meant to be joined directly)
            queryset = queryset.filter(is_recurring_template=False)
            
            # Apply advance availability filtering
            available_contests = []
            for contest in queryset:
                if contest.is_available_for_joining():
                    available_contests.append(contest.id)
            
            queryset = queryset.filter(id__in=available_contests)
        
        # Filter by active status (if explicitly requested)
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by recurring type (for admin)
        recurring = self.request.query_params.get('recurring', None)
        if recurring:
            queryset = queryset.filter(recurring=recurring)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        """Automatically set created_by to current admin"""
        try:
            admin = Admin.objects.get(profile__user=self.request.user)
            serializer.save(created_by=admin)
        except Admin.DoesNotExist:
            # This shouldn't happen due to permission check, but just in case
            raise permissions.PermissionDenied("Only admins can create contests")
    
    @extend_schema(
        request=None,
        responses={200: ContestParticipantSerializer},
        description="Join a contest as a contributor"
    )
    @decorators.action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        """
        Allow users and contributors to join a contest.
        - Users/Judges: Enter to vote (no image required)
        - Contributors: Participate with their images (image required)
        """
        try:
            contest = self.get_object()
            
            # Check if contest is active
            if not contest.is_active:
                return Response(
                    {'error': 'This contest is not active'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if user has a profile
            try:
                profile = request.user.profile
            except Profile.DoesNotExist:
                return Response(
                    {'error': 'Profile not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Allow both users (judges) and contributors to join
            # Users join for voting, contributors join to participate
            
            # Check if contest is full (using dynamic count)
            current_participants = contest.participants.count()
            if current_participants >= contest.max_participants:
                return Response(
                    {'error': 'Contest is full. Maximum participants reached.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if already joined - if so, return success so frontend can navigate to voting
            existing_participant = ContestParticipant.objects.filter(contest=contest, contributor=profile).first()
            if existing_participant:
                serializer = ContestParticipantSerializer(existing_participant, context={'request': request})
                return Response({
                    'message': 'Already joined - opening contest',
                    'already_joined': True,
                    'contest_id': contest.id,
                    'contest_name': contest.title,
                    'joined_at': existing_participant.joined_at,
                    'participant': serializer.data
                }, status=status.HTTP_200_OK)
            
            # ELIGIBILITY CHECK DISABLED - Allow any contributor to join any contest
            # Uncomment the lines below to re-enable attribute-based eligibility checking:
            # is_eligible = self._check_eligibility(profile, contest)
            # if not is_eligible:
            #     return Response(
            #         {'error': 'You do not meet the contest requirements'},
            #         status=status.HTTP_400_BAD_REQUEST
            #     )
            
            # Image handling - only required for contributors
            matching_image = None
            
            if profile.role == 'contributor':
                # Get body_part_image_id from request if provided
                body_part_image_id = request.data.get('body_part_image_id', None)
                
                if body_part_image_id:
                    # User selected a specific image
                    try:
                        matching_image = BodyPartImage.objects.get(
                            id=body_part_image_id,
                            user=request.user
                        )
                        # Verify the image matches the contest category
                        if matching_image.body_part.lower() != contest.category.lower():
                            return Response(
                                {'error': f'Selected image does not match contest category "{contest.category}"'},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                    except BodyPartImage.DoesNotExist:
                        return Response(
                            {'error': 'Selected image not found or does not belong to you'},
                            status=status.HTTP_404_NOT_FOUND
                        )
                else:
                    # Auto-select: Find matching body part image for this contest category
                    # If there's one image in the category → auto-join it
                    # If there are multiple images → auto-join the first one (by upload date) until user changes it
                    matching_image = BodyPartImage.objects.filter(
                        user=request.user,
                        body_part=contest.category
                    ).order_by('created_at').first()  # Always select the first uploaded image
                    
                    if not matching_image:
                        # If no exact match, try to find any image from this user (first by creation date)
                        matching_image = BodyPartImage.objects.filter(
                            user=request.user
                        ).order_by('created_at').first()
                    
                    if not matching_image:
                        return Response(
                            {'error': f'You need to upload a "{contest.category}" image before joining this contest'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
            
            # Create participant entry
            # For users/judges, body_part_image can be None (they're just voting)
            # For contributors, body_part_image is required
            participant = ContestParticipant.objects.create(
                contest=contest,
                contributor=profile,
                auto_entry=False,
                body_part_image=matching_image  # None for users, image for contributors
            )
            
            # Create notifications for users who favorited this contributor's images (only for contributors)
            if profile.role == 'contributor':
                self._create_favorite_notifications(request.user, profile, contest)
            
            serializer = ContestParticipantSerializer(participant, context={'request': request})
            response_data = {
                'message': 'Successfully joined the contest' if profile.role == 'contributor' else 'Successfully entered the contest for voting',
                'contest_id': contest.id,
                'contest_name': contest.title,
                'joined_at': participant.joined_at,
                'participant': serializer.data
            }
            
            # Add image info only for contributors
            if matching_image:
                response_data['body_part_image_id'] = matching_image.id
                response_data['body_part_image_url'] = request.build_absolute_uri(matching_image.image.url) if matching_image.image else None
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            # Log the error for debugging
            print("=" * 80)
            print("ERROR IN JOIN ACTION:")
            print(traceback.format_exc())
            print("=" * 80)
            
            return Response(
                {'error': f'An error occurred while joining the contest: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @extend_schema(
        request={'application/json': {
            'type': 'object',
            'properties': {
                'body_part_image_id': {'type': 'integer', 'description': 'ID of the body part image to use'}
            },
            'required': ['body_part_image_id']
        }},
        responses={200: ContestParticipantSerializer},
        description="Change the body part image for a contest you've already joined"
    )
    @decorators.action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='change-image')
    def change_image(self, request, pk=None):
        """
        Allow contributors to change their selected image for a contest they've already joined.
        """
        try:
            contest = self.get_object()
            body_part_image_id = request.data.get('body_part_image_id')
            
            if not body_part_image_id:
                return Response(
                    {'error': 'body_part_image_id is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get contributor's profile
            try:
                profile = request.user.profile
            except Profile.DoesNotExist:
                return Response(
                    {'error': 'Profile not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Check if contributor has joined this contest
            try:
                participant = ContestParticipant.objects.get(
                    contest=contest,
                    contributor=profile
                )
            except ContestParticipant.DoesNotExist:
                return Response(
                    {'error': 'You have not joined this contest yet'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Verify the new image belongs to the user and matches the category
            try:
                new_image = BodyPartImage.objects.get(
                    id=body_part_image_id,
                    user=request.user
                )
                
                if new_image.body_part.lower() != contest.category.lower():
                    return Response(
                        {'error': f'Selected image does not match contest category "{contest.category}"'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except BodyPartImage.DoesNotExist:
                return Response(
                    {'error': 'Selected image not found or does not belong to you'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Update the participant's image
            participant.body_part_image = new_image
            participant.save()
            
            serializer = ContestParticipantSerializer(participant, context={'request': request})
            return Response({
                'message': 'Successfully changed contest image',
                'contest_id': contest.id,
                'body_part_image_id': new_image.id,
                'body_part_image_url': request.build_absolute_uri(new_image.image.url) if new_image.image else None,
                'participant': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print("=" * 80)
            print("ERROR IN CHANGE_IMAGE ACTION:")
            print(traceback.format_exc())
            print("=" * 80)
            
            return Response(
                {'error': f'An error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _create_favorite_notifications(self, contributor_user, contributor_profile, contest):
        """
        Create notifications for all users who have favorited this contributor's images.
        """
        try:
            # Find all users who have favorited any image from this contributor
            favorited_by_users = FavoriteImage.objects.filter(
                body_part_image__user=contributor_user
            ).values_list('user', flat=True).distinct()
            
            # Create notification for each user
            contributor_name = contributor_profile.screen_name or contributor_user.username
            
            for user_id in favorited_by_users:
                Notification.objects.create(
                    user_id=user_id,
                    notification_type='favorite_contest_join',
                    title=f"{contributor_name} joined a contest!",
                    message=f"Your favorited contributor {contributor_name} has joined '{contest.title}'. Check it out!",
                    contest=contest,
                    contributor=contributor_profile
                )
        except Exception as e:
            # Don't fail the join if notifications fail
            print(f"Error creating notifications: {str(e)}")
    
    def _check_eligibility(self, profile, contest):
        """
        Check if a contributor is eligible for a contest based on attributes.
        Returns True if all contest attribute requirements are met.
        """
        # Handle both dict and string JSON (just in case)
        contest_attrs = contest.attributes
        if isinstance(contest_attrs, str):
            try:
                contest_attrs = json.loads(contest_attrs)
            except (json.JSONDecodeError, ValueError):
                contest_attrs = {}
        
        if not contest_attrs:
            return True  # No requirements means everyone is eligible
        
        for category, required_values in contest_attrs.items():
            if not required_values:  # Skip if no values specified
                continue
            
            # Skip "All" values
            if "All" in required_values:
                continue
            
            # Get contributor's value for this attribute
            contributor_value = None
            
            # Map contest attribute names to profile fields
            attr_mapping = {
                "Gender": "gender",
                "Age": "age",  # This needs special handling
                "Skin Tone": "skin_tone",
                "Body Type": "body_type",
                "Hair Color": "hair_color",
                "Shoe Size": "shoe_size",
                "Bust Size": "bust_size",
                "Penis Size": "penis_length",
            }
            
            profile_field = attr_mapping.get(category)
            if profile_field:
                contributor_value = getattr(profile, profile_field, None)
            
            # Check if contributor's value matches any of the required values
            if contributor_value and contributor_value not in required_values:
                return False
        
        return True
    
    @extend_schema(
        responses={200: ContestParticipantSerializer(many=True)},
        description="Get all participants of a contest"
    )
    @decorators.action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        """Get all participants of a specific contest"""
        contest = self.get_object()
        participants = contest.participants.all()
        serializer = ContestParticipantSerializer(participants, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        responses={200: ProfileSerializer(many=True)},
        description="Get all eligible contributors for a contest based on attributes"
    )
    @decorators.action(detail=True, methods=['get'], permission_classes=[IsAdminOrReadOnly])
    def eligible_contributors(self, request, pk=None):
        """
        Get all contributors who are eligible for this contest based on attributes.
        Admin only endpoint.
        """
        contest = self.get_object()
        
        # Get all contributors
        contributors = Profile.objects.filter(role='contributor')
        
        # Filter by eligibility
        eligible = [c for c in contributors if self._check_eligibility(c, contest)]
        
        serializer = ProfileSerializer(eligible, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        responses={200: ContestSerializer(many=True)},
        description="Get all contests that the current user has joined"
    )
    @decorators.action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='my-contests')
    def my_contests(self, request):
        """
        Get all contests that the current user/contributor has joined.
        Returns active contests ordered by start time.
        """
        user = request.user
        
        # Check if user has a profile
        try:
            profile = user.profile
        except Profile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get contest IDs that the user has joined
        joined_contest_ids = ContestParticipant.objects.filter(
            contributor=profile
        ).values_list('contest_id', flat=True)
        
        # Get the actual contest objects
        user_contests = Contest.objects.filter(
            id__in=joined_contest_ids,
            is_active=True
        ).order_by('-start_time')
        
        serializer = ContestSerializer(user_contests, many=True, context={'request': request})
        return Response(serializer.data)


# ══════════════════════════════════════════════════════════════════════
# SMOKE SIGNALS VIEWSET
# ══════════════════════════════════════════════════════════════════════

import os
import traceback
from django.conf import settings
from django.core.mail import send_mail
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import SmokeSignal
from .serializers import SmokeSignalSerializer

try:
    from twilio.rest import Client
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False


class SmokeSignalViewSet(viewsets.ModelViewSet):
    """
    Simple ViewSet for sending and listing smoke signals via Email or SMS.
    Integrated with Swagger (default DRF schema).
    """
    queryset = SmokeSignal.objects.all().order_by('-timestamp')
    serializer_class = SmokeSignalSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def send(self, request):
        """
        Send a smoke signal message via Email or SMS.
        ---
        parameters:
            - name: to
              description: Recipient email address or phone number (+1234567890)
              required: true
              type: string
              paramType: form
            - name: channel
              description: Choose 'Email' or 'SMS'
              required: true
              type: string
              paramType: form
            - name: message
              description: Message content
              required: true
              type: string
              paramType: form
            - name: sender
              description: Sender name (optional)
              required: false
              type: string
              paramType: form
        responses:
            201:
                description: Message sent successfully
            400:
                description: Missing or invalid parameters
            500:
                description: Sending failed
        """
        to = request.data.get('to')
        channel = request.data.get('channel')
        message = request.data.get('message')
        sender = request.data.get('sender', 'System')

        if not all([to, channel, message]):
            return Response(
                {'error': 'Fields "to", "channel", and "message" are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        status_value = 'Pending'

        try:
            # Handle Email
            if channel.lower() == 'email':
                send_mail(
                    subject=f"Notification from {sender}",
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[to],
                    fail_silently=False,
                )
                status_value = 'Delivered'

            # Handle SMS
            elif channel.lower() == 'sms':
                if not TWILIO_AVAILABLE:
                    raise RuntimeError("Twilio library not installed.")
                account_sid = os.getenv('TWILIO_ACCOUNT_SID')
                auth_token = os.getenv('TWILIO_AUTH_TOKEN')
                twilio_from = os.getenv('TWILIO_PHONE_NUMBER')

                if not all([account_sid, auth_token, twilio_from]):
                    raise RuntimeError("Twilio credentials missing or not configured.")

                client = Client(account_sid, auth_token)
                client.messages.create(body=message, from_=twilio_from, to=to)
                status_value = 'Delivered'

            else:
                return Response(
                    {'error': 'Invalid channel. Must be "Email" or "SMS".'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            status_value = 'Failed'
            traceback.print_exc()
            return Response(
                {'error': f'Failed to send message: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Create and save record
        record = SmokeSignal.objects.create(
            sender=sender,
            recipient=to,
            channel=channel,
            status=status_value,
            message=message
        )

        serializer = SmokeSignalSerializer(record)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ══════════════════════════════════════════════════════════════════════
# FAVORITE IMAGE VIEWSET
# ══════════════════════════════════════════════════════════════════════

class FavoriteImageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing favorite images.
    Users can add, remove, and list their favorite contributor images.
    """
    serializer_class = FavoriteImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only the logged-in user's favorite images"""
        return FavoriteImage.objects.filter(user=self.request.user).select_related(
            'body_part_image', 'body_part_image__user', 'body_part_image__user__profile'
        )

    @extend_schema(
        summary="List all favorite images for the current user",
        description="Returns a list of all images the user has favorited, with contributor details.",
        responses={200: FavoriteImageSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        """List all favorite images for the current user"""
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Add an image to favorites",
        request=AddFavoriteSerializer,
        responses={
            201: FavoriteImageSerializer,
            400: OpenApiResponse(description="Image already favorited or invalid image ID"),
        }
    )
    @decorators.action(detail=False, methods=['post'], url_path='add')
    def add_favorite(self, request):
        """
        Add an image to favorites.
        Requires: body_part_image_id
        """
        serializer = AddFavoriteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        body_part_image_id = serializer.validated_data['body_part_image_id']
        
        try:
            body_part_image = BodyPartImage.objects.get(id=body_part_image_id)
        except BodyPartImage.DoesNotExist:
            return Response(
                {'error': 'Body part image not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if already favorited
        if FavoriteImage.objects.filter(user=request.user, body_part_image=body_part_image).exists():
            return Response(
                {'error': 'Image already in favorites'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create favorite
        favorite = FavoriteImage.objects.create(
            user=request.user,
            body_part_image=body_part_image
        )

        serializer = FavoriteImageSerializer(favorite, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Remove an image from favorites",
        responses={
            204: OpenApiResponse(description="Image removed from favorites"),
            404: OpenApiResponse(description="Favorite not found"),
        }
    )
    @decorators.action(detail=False, methods=['delete'], url_path='remove/(?P<body_part_image_id>[^/.]+)')
    def remove_favorite(self, request, body_part_image_id=None):
        """
        Remove an image from favorites by body_part_image_id.
        """
        try:
            favorite = FavoriteImage.objects.get(
                user=request.user,
                body_part_image_id=body_part_image_id
            )
            favorite.delete()
            return Response(
                {'message': 'Image removed from favorites'},
                status=status.HTTP_204_NO_CONTENT
            )
        except FavoriteImage.DoesNotExist:
            return Response(
                {'error': 'Favorite not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @extend_schema(
        summary="Toggle favorite status for an image",
        request=AddFavoriteSerializer,
        responses={
            200: OpenApiResponse(description="Image added to or removed from favorites"),
        }
    )
    @decorators.action(detail=False, methods=['post'], url_path='toggle')
    def toggle_favorite(self, request):
        """
        Toggle favorite status for an image.
        If favorited, removes it. If not favorited, adds it.
        """
        serializer = AddFavoriteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        body_part_image_id = serializer.validated_data['body_part_image_id']
        
        try:
            body_part_image = BodyPartImage.objects.get(id=body_part_image_id)
        except BodyPartImage.DoesNotExist:
            return Response(
                {'error': 'Body part image not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Try to find existing favorite
        favorite = FavoriteImage.objects.filter(
            user=request.user,
            body_part_image=body_part_image
        ).first()

        if favorite:
            # Remove from favorites
            favorite.delete()
            return Response(
                {'message': 'Image removed from favorites', 'is_favorite': False},
                status=status.HTTP_200_OK
            )
        else:
            # Add to favorites
            favorite = FavoriteImage.objects.create(
                user=request.user,
                body_part_image=body_part_image
            )
            serializer = FavoriteImageSerializer(favorite, context={'request': request})
            return Response(
                {'message': 'Image added to favorites', 'is_favorite': True, 'favorite': serializer.data},
                status=status.HTTP_200_OK
            )


# ══════════════════════════════════════════════════════════════════════
# VOTING VIEWSET
# ══════════════════════════════════════════════════════════════════════

class VoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing votes in contests.
    Users can vote once per contest.
    """
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """
        Override permissions for specific actions
        """
        if self.action in ['record_match_result', 'participants_sequence']:
            # Allow unauthenticated access for match result recording
            return [AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        """Return votes filtered by contest if specified"""
        queryset = Vote.objects.all().select_related('user', 'contest', 'participant')
        
        contest_id = self.request.query_params.get('contest', None)
        if contest_id:
            queryset = queryset.filter(contest_id=contest_id)
        
        # Users can only see their own votes
        if self.request.user.is_authenticated and hasattr(self.request.user, 'profile') and self.request.user.profile.role == 'user':
            queryset = queryset.filter(user=self.request.user)
        
        return queryset

    @extend_schema(
        summary="Cast a vote for a participant in a contest",
        request=CastVoteSerializer,
        responses={
            201: VoteSerializer,
            400: OpenApiResponse(description="Already voted or invalid participant"),
        }
    )
    @decorators.action(detail=False, methods=['post'], url_path='cast')
    def cast_vote(self, request):
        """
        Cast a vote for a participant in a contest.
        Users can only vote once per contest.
        """
        serializer = CastVoteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        participant_id = serializer.validated_data['participant_id']
        
        try:
            participant = ContestParticipant.objects.get(id=participant_id)
        except ContestParticipant.DoesNotExist:
            return Response(
                {'error': 'Participant not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        contest = participant.contest

        # Check if user is a contributor (contributors can't vote)
        if request.user.profile.role != 'user':
            return Response(
                {'error': 'Only users can vote in contests'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if already voted in this contest
        if Vote.objects.filter(user=request.user, contest=contest).exists():
            return Response(
                {'error': 'You have already voted in this contest'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create vote
        vote = Vote.objects.create(
            user=request.user,
            contest=contest,
            participant=participant
        )

        vote_serializer = VoteSerializer(vote, context={'request': request})
        return Response(
            {
                'message': 'Vote cast successfully',
                'vote': vote_serializer.data,
                'participant_id': participant.id,
                'contest_id': contest.id
            },
            status=status.HTTP_201_CREATED
        )

    @extend_schema(
        summary="Get user's vote for a specific contest",
        responses={200: VoteSerializer}
    )
    @decorators.action(detail=False, methods=['get'], url_path='my-vote/(?P<contest_id>[^/.]+)')
    def my_vote(self, request, contest_id=None):
        """
        Get the user's vote for a specific contest.
        """
        try:
            vote = Vote.objects.get(user=request.user, contest_id=contest_id)
            serializer = VoteSerializer(vote, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Vote.DoesNotExist:
            return Response(
                {'voted': False, 'message': 'No vote cast yet'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @extend_schema(
        summary="Record match result (winner of a round)",
        request={'application/json': {
            'type': 'object',
            'properties': {
                'winner_id': {'type': 'integer'},
                'loser_id': {'type': 'integer'},
                'vote_count_winner': {'type': 'integer'},
                'vote_count_loser': {'type': 'integer'}
            }
        }},
        responses={200: {}}
    )
    @decorators.action(detail=False, methods=['post'])
    def record_match_result(self, request):
        """
        Record the result of a 30-second match/round.
        Stores winner and updates consecutive wins counter.
        """
        winner_id = request.data.get('winner_id')
        loser_id = request.data.get('loser_id')
        vote_count_winner = request.data.get('vote_count_winner', 0)
        vote_count_loser = request.data.get('vote_count_loser', 0)
        
        if not winner_id or not loser_id:
            return Response(
                {'error': 'winner_id and loser_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            winner = ContestParticipant.objects.get(id=winner_id)
            loser = ContestParticipant.objects.get(id=loser_id)
            
            if winner.contest_id != loser.contest_id:
                return Response(
                    {'error': 'Participants must be from the same contest'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            contest = winner.contest
            
            # Get the last vote for this winner to check consecutive wins
            last_vote = Vote.objects.filter(
                contest=contest,
                participant=winner
            ).order_by('-voted_at').first()
            
            consecutive_wins = 1
            if last_vote:
                consecutive_wins = last_vote.consecutive_wins + 1
            
            # Create a vote record for this match result
            # For match results, we'll use the authenticated user or skip user requirement
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            # Try to get any valid user for system voting
            if request.user.is_authenticated:
                system_user = request.user
            else:
                # Get any admin or first user as system user
                system_user = User.objects.filter(is_staff=True).first() or User.objects.first()
                
                if not system_user:
                    return Response(
                        {'error': 'No user available to record vote'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            try:
                vote = Vote.objects.create(
                    user=system_user,
                    contest=contest,
                    participant=winner,
                    consecutive_wins=consecutive_wins
                )
            except Exception as vote_error:
                return Response(
                    {'error': f'Failed to create vote record: {str(vote_error)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Check if reset is needed (10 consecutive wins)
            reset_matchup = consecutive_wins >= 10
            
            return Response({
                'message': 'Match result recorded successfully',
                'winner_id': winner.id,
                'loser_id': loser.id,
                'consecutive_wins': consecutive_wins,
                'reset_matchup': reset_matchup,
                'vote_count_winner': vote_count_winner,
                'vote_count_loser': vote_count_loser
            }, status=status.HTTP_200_OK)
            
        except ContestParticipant.DoesNotExist:
            return Response(
                {'error': 'Participant not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Internal error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @extend_schema(
        summary="Get participants for sequential voting",
        responses={200: {}}
    )
    @decorators.action(detail=False, methods=['get'])
    def participants_sequence(self, request):
        """
        Get all participants for a contest in the order they joined.
        Used for sequential voting system.
        """
        contest_id = request.query_params.get('contest_id')
        
        if not contest_id:
            return Response(
                {'error': 'contest_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            contest = Contest.objects.get(id=contest_id)
        except Contest.DoesNotExist:
            return Response(
                {'error': 'Contest not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get all participants ordered by joined_at (ascending - first to join at the top)
        participants = ContestParticipant.objects.filter(
            contest=contest
        ).select_related('contributor', 'body_part_image', 'body_part_image__user').order_by('joined_at')
        
        participants_data = []
        for participant in participants:
            participants_data.append({
                'id': participant.id,
                'contributor_name': participant.contributor.screen_name or participant.contributor.user.username,
                'contributor_id': participant.contributor.id,
                'body_part_image_id': participant.body_part_image.id if participant.body_part_image else None,
                'image_url': request.build_absolute_uri(participant.body_part_image.image.url) if participant.body_part_image and participant.body_part_image.image else None,
                'votes_count': participant.votes.count(),
                'joined_at': participant.joined_at.isoformat()
            })
        
        return Response({
            'contest_id': contest.id,
            'total_participants': participants.count(),
            'participants': participants_data
        }, status=status.HTTP_200_OK)
    
    @extend_schema(
        summary="Get contest results with rankings",
        responses={200: {}}
    )
    @decorators.action(detail=False, methods=['get'])
    def contest_results(self, request):
        """
        Get final results for a contest showing rankings based on votes.
        Returns participants ranked by total votes received.
        """
        contest_id = request.query_params.get('contest_id')
        
        if not contest_id:
            return Response(
                {'error': 'contest_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            contest = Contest.objects.get(id=contest_id)
        except Contest.DoesNotExist:
            return Response(
                {'error': 'Contest not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get all participants with their vote counts
        from django.db.models import Count, Sum
        participants = ContestParticipant.objects.filter(
            contest=contest
        ).select_related('contributor', 'body_part_image').annotate(
            total_votes=Count('votes')
        ).order_by('-total_votes', 'joined_at')
        
        results_data = []
        for idx, participant in enumerate(participants, start=1):
            # Get all voters for this participant
            votes = Vote.objects.filter(
                contest=contest,
                participant=participant
            ).select_related('user')
            
            voter_names = [vote.user.username for vote in votes]
            
            results_data.append({
                'place': idx,
                'participant_id': participant.id,
                'screen_name': participant.contributor.screen_name or participant.contributor.user.username,
                'contributor_id': participant.contributor.id,
                'image_url': request.build_absolute_uri(participant.body_part_image.image.url) if participant.body_part_image and participant.body_part_image.image else None,
                'total_votes': participant.total_votes,
                'voters': voter_names,
                'joined_at': participant.joined_at.isoformat()
            })
        
        return Response({
            'contest_id': contest.id,
            'contest_title': contest.title,
            'contest_category': contest.category,
            'contest_end_time': contest.end_time.isoformat() if contest.end_time else None,
            'total_participants': participants.count(),
            'results': results_data
        }, status=status.HTTP_200_OK)


# ══════════════════════════════════════════════════════════════════════
# NOTIFICATION VIEWSET
# ══════════════════════════════════════════════════════════════════════

class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user notifications.
    Users can view their notifications and mark them as read.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only the logged-in user's notifications"""
        return Notification.objects.filter(user=self.request.user).select_related(
            'contest', 'contributor', 'contributor__user'
        )

    @extend_schema(
        summary="List all notifications for the current user",
        description="Returns unread and read notifications.",
        responses={200: NotificationSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        """List all notifications for the current user"""
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Get unread notifications count",
        responses={200: {'type': 'object', 'properties': {'unread_count': {'type': 'integer'}}}}
    )
    @decorators.action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        """
        Get the count of unread notifications.
        """
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'unread_count': count}, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Mark a notification as read",
        responses={200: NotificationSerializer}
    )
    @decorators.action(detail=True, methods=['post'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        """
        Mark a notification as read.
        """
        try:
            notification = self.get_object()
            notification.is_read = True
            notification.save()
            serializer = NotificationSerializer(notification, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response(
                {'error': 'Notification not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @extend_schema(
        summary="Mark all notifications as read",
        responses={200: {'type': 'object', 'properties': {'message': {'type': 'string'}}}}
    )
    @decorators.action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        """
        Mark all user's notifications as read.
        """
        updated_count = Notification.objects.filter(
            user=request.user, 
            is_read=False
        ).update(is_read=True)
        
        return Response(
            {'message': f'Marked {updated_count} notifications as read'},
            status=status.HTTP_200_OK
        )
