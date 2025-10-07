from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample


@extend_schema(
    responses={
        200: OpenApiResponse(
            description="User dashboard data",
            response=dict,
            examples=[
                OpenApiExample(
                    "User Dashboard",
                    value={
                        "user_type": "Judge",
                        "total_votes_cast": 156,
                        "contests_judged": 8,
                        "favorite_creators": 12,
                        "wallet_balance": 125.50,
                        "recent_activity": [
                            {"action": "Voted on Contest #123", "date": "2025-09-08"},
                            {"action": "Added creator to favorites", "date": "2025-09-07"},
                        ],
                    },
                )
            ],
        ),
    },
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    # Dummy data for user/judge dashboard
    return Response(
        {
            "user_type": "Judge",
            "total_votes_cast": 156,
            "contests_judged": 8,
            "favorite_creators": 12,
            "wallet_balance": 125.50,
            "recent_activity": [
                {"action": "Voted on Contest #123", "date": "2025-09-08"},
                {"action": "Added creator to favorites", "date": "2025-09-07"},
                {"action": "Withdrew $50.00", "date": "2025-09-06"},
            ],
        }
    )


@extend_schema(
    responses={
        200: OpenApiResponse(
            description="Contributor dashboard data",
            response=dict,
            examples=[
                OpenApiExample(
                    "Contributor Dashboard",
                    value={
                        "user_type": "Content Contributor",
                        "contests_joined": 12,
                        "best_finish": 1,
                        "top_3_finishes": 4,
                        "top_10_finishes": 9,
                        "total_earnings": 1250.75,
                        "pending_payouts": 180.25,
                        "gallery_views": 2847,
                        "recent_contests": [
                            {"contest": "Summer Photo Contest", "position": 2, "prize": 150.00},
                            {"contest": "Portrait Challenge", "position": 5, "prize": 75.00},
                        ],
                    },
                )
            ],
        ),
    },
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def contributor_dashboard(request):
    # Dummy data for contributor dashboard
    return Response(
        {
            "user_type": "Content Contributor",
            "contests_joined": 12,
            "best_finish": 1,
            "top_3_finishes": 4,
            "top_10_finishes": 9,
            "total_earnings": 1250.75,
            "pending_payouts": 180.25,
            "gallery_views": 2847,
            "recent_contests": [
                {"contest": "Summer Photo Contest", "position": 2, "prize": 150.00},
                {"contest": "Portrait Challenge", "position": 5, "prize": 75.00},
                {"contest": "Nature Photography", "position": 1, "prize": 300.00},
            ],
        }
    )

# Create your views here.
