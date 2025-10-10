from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from rest_framework import status, generics, permissions, viewsets, decorators
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from .models import BodyPartImage, Contest, ContestParticipant, Admin
from .serializers import BodyPartImageSerializer


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
)
from .models import Profile, Payment, Admin


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    return Response(
        {
            "detail": "Deprecated. Use /api/accounts/register/user/ or /api/accounts/register/contributor/"
        },
        status=410,
    )


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
@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
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

    # ✅ Simple password check
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(ProfileSerializer(request.user.profile, context={'request': request}).data)


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
@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
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
@api_view(["POST"])
@permission_classes([AllowAny])
def register_contributor(request):
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
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_funds(request):
    """
    Add funds to user account using payment information.
    """
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


class MyProfileView(generics.RetrieveUpdateAPIView):  # ✅ allow update
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile




class BodyPartImageViewSet(viewsets.ModelViewSet):
    serializer_class = BodyPartImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BodyPartImage.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def contributor_metrics(request):
    """
    Get contributor statistics and metrics.
    Returns counts based on various attributes.
    """
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def contributors_list(request):
    """
    Get all contributors with their complete profile data.
    Returns list of contributors for leaderboard and analytics.
    """
    try:
        # Get all contributors
        contributors = Profile.objects.filter(role='contributor').select_related('user')
        
        # Transform to frontend format
        contributors_data = []
        for profile in contributors:
            contributor_dict = {
                'id': profile.id,
                'name': profile.screen_name or profile.user.email,
                'email': profile.user.email,
                'gender': profile.gender or 'Unknown',
                'age': profile.age,
                'skinTone': profile.skin_tone or '',
                'hairColor': profile.hair_color or '',
                'bodyType': profile.body_type or profile.female_body_type or '',
                'shoeSize': profile.shoe_size or '',
                'height': profile.height or '',
                'weight': profile.weight or '',
                'cupSize': profile.bust_size or '',
                'penisLength': profile.penis_length or '',
                'bio': profile.bio or '',
                'created_at': profile.user.date_joined.isoformat() if profile.user.date_joined else None,
                # Placeholder for contest/earnings data - would come from contest participation
                'earnings': 0,
                'contestsWon': 0,
                'engagement': 0,
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
        Optionally filter contests by category, active status, etc.
        """
        queryset = Contest.objects.all()
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
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
        Allow contributors to join a contest.
        Contributors are automatically checked for eligibility based on their profile attributes.
        """
        contest = self.get_object()
        
        # Check if user has a profile
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if profile is a contributor
        if profile.role != 'contributor':
            return Response(
                {'error': 'Only contributors can join contests'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if contest is full
        if contest.joined >= contest.max_participants:
            return Response(
                {'error': 'Contest is full'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already joined
        if ContestParticipant.objects.filter(contest=contest, contributor=profile).exists():
            return Response(
                {'error': 'Already joined this contest'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check eligibility based on attributes
        is_eligible = self._check_eligibility(profile, contest)
        if not is_eligible:
            return Response(
                {'error': 'You do not meet the contest requirements'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create participant entry
        participant = ContestParticipant.objects.create(
            contest=contest,
            contributor=profile,
            auto_entry=False
        )
        
        # Increment joined count
        contest.joined += 1
        contest.save()
        
        return Response({
            'message': 'Successfully joined the contest',
            'participant': ContestParticipantSerializer(participant).data
        }, status=status.HTTP_201_CREATED)
    
    def _check_eligibility(self, profile, contest):
        """
        Check if a contributor is eligible for a contest based on attributes.
        Returns True if all contest attribute requirements are met.
        """
        contest_attrs = contest.attributes or {}
        
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


