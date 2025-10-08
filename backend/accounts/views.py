from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from rest_framework import status, generics, permissions, viewsets, decorators
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from .models import BodyPartImage
from .serializers import BodyPartImageSerializer


from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    UserRegisterSerializer,
    ContributorRegisterSerializer,
    AddFundsSerializer,
    AdminSerializer,
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
            "profile": ProfileSerializer(user.profile).data,
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(ProfileSerializer(request.user.profile).data)


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
            "profile": ProfileSerializer(user.profile).data,
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
            "profile": ProfileSerializer(user.profile).data,
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


