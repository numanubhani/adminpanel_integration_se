from django.db.models import Count
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample

# Prize share of contest pool by rank (1st = 40%, 2nd = 25%, 3rd = 15%, 4–10 = remainder)
PRIZE_PCT_BY_RANK = {
    1: 0.40,
    2: 0.25,
    3: 0.15,
    4: 0.08,
    5: 0.05,
    6: 0.02,
    7: 0.02,
    8: 0.01,
    9: 0.01,
    10: 0.01,
}


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
    from accounts.models import Profile, Contest, ContestParticipant

    try:
        profile = request.user.profile
    except Exception:
        profile = None
    if not profile or profile.role != "contributor":
        return Response(
            {"user_type": "User", "contests_joined": 0, "best_finish": "-", "top_3_finishes": 0, "top_10_finishes": 0, "total_earnings": 0, "pending_payouts": 0, "gallery_views": 0, "recent_contests": []},
            status=200,
        )

    now = timezone.now()
    participations = (
        ContestParticipant.objects.filter(contributor=profile)
        .select_related("contest")
        .annotate(vote_count=Count("votes"))
    )

    contests_joined = participations.count()
    best_finish = None
    top_3_finishes = 0
    top_10_finishes = 0
    total_earnings = 0.0
    recent_contests = []

    for cp in participations:
        contest = cp.contest
        if contest.end_time and contest.end_time > now:
            continue
        ranked = (
            ContestParticipant.objects.filter(contest=contest)
            .annotate(vote_count=Count("votes"))
            .order_by("-vote_count", "joined_at")
        )
        position = None
        for idx, p in enumerate(ranked, start=1):
            if p.id == cp.id:
                position = idx
                break
        if position is None:
            continue

        if best_finish is None or position < best_finish:
            best_finish = position
        if position <= 3:
            top_3_finishes += 1
        if position <= 10:
            top_10_finishes += 1

        user_count = ContestParticipant.objects.filter(contest=contest, contributor__role="user").count()
        pool = float(user_count) * float(contest.cost) * 0.75
        pct = PRIZE_PCT_BY_RANK.get(position, 0)
        prize = round(pool * pct, 2)
        total_earnings += prize
        recent_contests.append({
            "contest": contest.title,
            "position": position,
            "prize": prize,
        })

    recent_contests.sort(key=lambda x: x.get("position", 99))
    recent_contests = recent_contests[:10]

    return Response(
        {
            "user_type": "Content Contributor",
            "contests_joined": contests_joined,
            "best_finish": best_finish if best_finish is not None else "-",
            "top_3_finishes": top_3_finishes,
            "top_10_finishes": top_10_finishes,
            "total_earnings": round(total_earnings, 2),
            "pending_payouts": 0,
            "gallery_views": 0,
            "recent_contests": recent_contests,
        }
    )


# Create your views here.
