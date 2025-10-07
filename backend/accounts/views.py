from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse
from rest_framework import viewsets
from .models import BodyPartImage
from .serializers import BodyPartImageSerializer


from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    UserRegisterSerializer,
    ContributorRegisterSerializer,
    AddFundsSerializer,
)
from .models import Profile, Payment


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
                "screen_name": "creator1",
                "creator_pathway": "photography",
                "first_name": "John",
                "last_name": "Doe",
                "phone_number": "+123456789",
                "address": "123 Main St",
                "city": "NYC",
                "state": "NY",
                "zip_code": "10001",
                "country": "US",
                "name_visibility": "public",
                "is_over_18": True,
                "bio": "Sample bio",
                "gender": "Male",
                "height": "5'10\"",
                "weight": "170",
                "shoe_size": "10.5",
                "skin_tone": "Medium",
                "hair_color": "Brown",
                "country_residence": "US",
                "nationality": "American",
                "occupation": "Photographer",
                "body_type": "Athletic/Average",
                "penis_length": "6-7.5",
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

