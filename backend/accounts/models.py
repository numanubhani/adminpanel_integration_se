from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    ROLE_CHOICES = (
        ("contributor", "Content Contributor"),
        ("user", "User"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")

    # Common fields
    legal_full_name = models.CharField(max_length=255, blank=True)
    allow_name_in_search = models.BooleanField(default=True)  # NEW
    screen_name = models.CharField(max_length=100, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    phone_number = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    country_residence = models.CharField(max_length=100, blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    occupation = models.CharField(max_length=100, blank=True)

    # Visibility & Bio
    name_visibility = models.CharField(max_length=20, default="public", blank=True)
    is_over_18 = models.BooleanField(default=False)
    bio = models.TextField(blank=True)

    # Contributor-specific optional fields
    creator_pathway = models.CharField(max_length=100, blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)

    # Physical attributes
    gender = models.CharField(max_length=10, blank=True)
    height = models.CharField(max_length=20, blank=True)
    weight = models.CharField(max_length=20, blank=True)
    shoe_size = models.CharField(max_length=10, blank=True)
    skin_tone = models.CharField(max_length=30, blank=True)
    hair_color = models.CharField(max_length=30, blank=True)

    # Male specific
    body_type = models.CharField(max_length=50, blank=True)
    penis_length = models.CharField(max_length=20, blank=True)

    # Female specific
    female_body_type = models.CharField(max_length=50, blank=True)
    bust_size = models.CharField(max_length=10, blank=True)
    milf = models.CharField(max_length=10, blank=True)

    # ID Document upload
    id_document = models.FileField(upload_to='id_documents/', blank=True, null=True)
    
    # Profile Picture
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    
    # Card Details (for admin panel)
    card_number = models.CharField(max_length=20, blank=True)

    def __str__(self) -> str:
        return f"{self.user.username} ({self.role})"


class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = (
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("cancelled", "Cancelled"),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments")
    card_number = models.CharField(max_length=20)  # Store masked card number
    expiry_date = models.CharField(max_length=10)  # MM/YYYY format
    security_code = models.CharField(max_length=4)  # CVV
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f"Payment {self.id} - {self.user.username} - ${self.amount}"
    

class BodyPartImage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="body_part_images")
    body_part = models.CharField(max_length=50)  # e.g. "Full Body", "Teaser"
    image = models.ImageField(upload_to="body_part_images/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.body_part}"


class Admin(models.Model):
    """
    Admin model that uses Profile (contributor) model via OneToOne relationship.
    Has all contributor fields through profile + is_admin flag.
    """
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name="admin_profile")
    is_admin = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Admin: {self.profile.user.email}"
    
    class Meta:
        verbose_name = "Admin"
        verbose_name_plural = "Admins"


class Contest(models.Model):
    """
    Contest model for managing contests.
    Admins can create, edit, delete contests.
    Users and contributors can view and join contests.
    """
    RECURRING_CHOICES = (
        ("none", "One-time"),
        ("daily", "Daily"),
        ("weekly", "Weekly"),
        ("monthly", "Monthly"),
    )
    
    # Basic info
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)  # Full Body, Chest & Stomach, etc.
    image = models.TextField(blank=True)  # Contest image URL or data URL
    
    # Attributes (stored as JSON)
    attributes = models.JSONField(default=dict, blank=True)
    # Example: {"Gender": ["Male"], "Age": ["18-25"], ...}
    
    # Participant limits
    joined = models.IntegerField(default=0)
    max_participants = models.IntegerField(default=500)
    
    # Timing
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    recurring = models.CharField(max_length=20, choices=RECURRING_CHOICES, default="none")
    
    # Cost
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Meta
    created_by = models.ForeignKey(Admin, on_delete=models.SET_NULL, null=True, related_name="created_contests")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.title} - {self.category}"
    
    class Meta:
        verbose_name = "Contest"
        verbose_name_plural = "Contests"
        ordering = ['-created_at']


class ContestParticipant(models.Model):
    """
    Tracks which contributors have joined which contests.
    """
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, related_name="participants")
    contributor = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="contest_entries")
    joined_at = models.DateTimeField(auto_now_add=True)
    auto_entry = models.BooleanField(default=False)  # Whether they were auto-entered
    
    class Meta:
        unique_together = ('contest', 'contributor')
        verbose_name = "Contest Participant"
        verbose_name_plural = "Contest Participants"
        ordering = ['-joined_at']
    
    def __str__(self):
        return f"{self.contributor.screen_name} in {self.contest.title}"


class SmokeSignal(models.Model):
    """
    Smoke Signal model for tracking notifications sent via Email or SMS.
    Used for monitoring and analytics of system communications.
    """
    CHANNEL_EMAIL = 'Email'
    CHANNEL_SMS = 'SMS'
    CHANNEL_CHOICES = [(CHANNEL_EMAIL, 'Email'), (CHANNEL_SMS, 'SMS')]

    STATUS_DELIVERED = 'Delivered'
    STATUS_FAILED = 'Failed'
    STATUS_PENDING = 'Pending'
    STATUS_CHOICES = [
        (STATUS_DELIVERED, 'Delivered'),
        (STATUS_FAILED, 'Failed'),
        (STATUS_PENDING, 'Pending'),
    ]

    sender = models.CharField(max_length=200)
    channel = models.CharField(max_length=10, choices=CHANNEL_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING)
    timestamp = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=255)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Smoke Signal"
        verbose_name_plural = "Smoke Signals"

    def __str__(self):
        return f'{self.channel} | {self.status} | {self.sender} | {self.message}'