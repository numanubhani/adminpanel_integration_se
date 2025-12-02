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
    active_profile_image = models.ForeignKey('BodyPartImage', on_delete=models.SET_NULL, null=True, blank=True, related_name='profile_active_for')
    
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
    
    # Recurring contest tracking
    parent_contest = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='recurring_instances')
    next_generation_date = models.DateTimeField(null=True, blank=True)
    is_recurring_template = models.BooleanField(default=False)  # Original contest that generates others
    
    # Cost
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Meta
    created_by = models.ForeignKey(Admin, on_delete=models.SET_NULL, null=True, related_name="created_contests")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.title} - {self.category}"
    
    def save(self, *args, **kwargs):
        # Handle recurring contest logic
        if self.recurring != "none" and not self.pk:
            # Check if this should be a template (for management commands) or regular contest (for admin panel)
            force_template = getattr(self, '_force_template', False)
            
            if force_template:
                # Explicitly created as template by management command
                self.is_recurring_template = True
                self.next_generation_date = self.calculate_next_generation_date()
            else:
                # Created from admin panel - make it a regular contest that users can join
                self.is_recurring_template = False
                # Set next generation date for this contest to generate future instances
                self.next_generation_date = self.calculate_next_generation_date()
        
        super().save(*args, **kwargs)
    
    def calculate_next_generation_date(self):
        """Calculate when the next recurring contest should be generated"""
        from datetime import timedelta
        
        if self.recurring == "daily":
            # Generate 1 day before start time (24 hours advance)
            return self.start_time - timedelta(days=1)
        elif self.recurring == "weekly":
            # Generate 1 week before start time (7 days advance)
            return self.start_time - timedelta(weeks=1)
        elif self.recurring == "monthly":
            # Generate 1 month before start time (approximately 30 days advance)
            return self.start_time - timedelta(days=30)
        return None
    
    def get_advance_period(self):
        """Get how many days/weeks/months in advance the contest should be available"""
        if self.recurring == "daily":
            return {"days": 1}
        elif self.recurring == "weekly":
            return {"days": 7}
        elif self.recurring == "monthly":
            return {"days": 30}
        return {"days": 0}
    
    def calculate_available_from_date(self):
        """Calculate when this contest should become available for contributors to join"""
        from datetime import timedelta
        
        if self.recurring == "daily":
            return self.start_time - timedelta(days=1)
        elif self.recurring == "weekly":
            return self.start_time - timedelta(days=7)
        elif self.recurring == "monthly":
            return self.start_time - timedelta(days=30)
        # For one-time contests, available immediately
        return self.created_at
    
    def is_available_for_joining(self):
        """Check if this contest is available for contributors to join"""
        from django.utils import timezone
        now = timezone.now()
        
        # Must be active
        if not self.is_active:
            return False
            
        # Must not have ended
        if now > self.end_time:
            return False
            
        # Check advance availability rules
        available_from = self.calculate_available_from_date()
        return now >= available_from
    
    def generate_next_recurring_contest(self):
        """Generate the next instance of this recurring contest"""
        from datetime import timedelta
        from dateutil.relativedelta import relativedelta
        
        if self.recurring == "none":
            return None
            
        # Calculate new dates based on recurring type
        if self.recurring == "daily":
            new_start = self.start_time + timedelta(days=1)
            new_end = self.end_time + timedelta(days=1)
        elif self.recurring == "weekly":
            new_start = self.start_time + timedelta(weeks=1)
            new_end = self.end_time + timedelta(weeks=1)
        elif self.recurring == "monthly":
            new_start = self.start_time + relativedelta(months=1)
            new_end = self.end_time + relativedelta(months=1)
        else:
            return None
            
        # Create new contest instance
        new_contest = Contest.objects.create(
            title=self.title,
            category=self.category,
            image=self.image,
            attributes=self.attributes.copy(),
            max_participants=self.max_participants,
            start_time=new_start,
            end_time=new_end,
            recurring=self.recurring,
            cost=self.cost,
            created_by=self.created_by,
            is_active=True,
            parent_contest=self.parent_contest or self,  # Link to parent or self if no parent
            is_recurring_template=False
        )
        
        # Update next generation date (works for both templates and regular recurring contests)
        if self.recurring == "daily":
            self.next_generation_date = new_start - timedelta(days=1)
        elif self.recurring == "weekly":
            self.next_generation_date = new_start - timedelta(days=7)
        elif self.recurring == "monthly":
            self.next_generation_date = new_start - timedelta(days=30)
        self.save()
        
        return new_contest
    
    @classmethod
    def generate_due_recurring_contests(cls):
        """Generate all recurring contests that are due"""
        from django.utils import timezone
        now = timezone.now()
        
        # Find all recurring contests (both templates and regular) that need generation
        due_contests = cls.objects.filter(
            recurring__in=['daily', 'weekly', 'monthly'],
            next_generation_date__lte=now,
            is_active=True
        )
        
        generated_contests = []
        for contest in due_contests:
            new_contest = contest.generate_next_recurring_contest()
            if new_contest:
                generated_contests.append(new_contest)
        
        return generated_contests
    
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
    body_part_image = models.ForeignKey(BodyPartImage, on_delete=models.SET_NULL, null=True, blank=True, related_name="contest_submissions")
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
    recipient = models.CharField(max_length=200, blank=True)  # Email or phone number of recipient
    channel = models.CharField(max_length=10, choices=CHANNEL_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_PENDING)
    timestamp = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=255)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Smoke Signal"
        verbose_name_plural = "Smoke Signals"

    def __str__(self):
        return f'{self.channel} | {self.status} | {self.sender} → {self.recipient} | {self.message}'


class FavoriteImage(models.Model):
    """
    Model for tracking favorite images.
    Users can favorite contributor images to view them later in their dashboard.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorite_images")
    body_part_image = models.ForeignKey(BodyPartImage, on_delete=models.CASCADE, related_name="favorited_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'body_part_image')
        ordering = ['-created_at']
        verbose_name = "Favorite Image"
        verbose_name_plural = "Favorite Images"

    def __str__(self):
        return f"{self.user.username} favorited {self.body_part_image.body_part} by {self.body_part_image.user.username}"


class FavoriteGallery(models.Model):
    """
    Model for tracking favorite galleries (contributor + body part).
    Users can favorite an entire gallery instead of individual images.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorite_galleries")
    contributor = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="favorited_galleries")
    body_part = models.CharField(max_length=50)  # e.g. "Full Body", "Feet"
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'contributor', 'body_part')
        ordering = ['-created_at']
        verbose_name = "Favorite Gallery"
        verbose_name_plural = "Favorite Galleries"

    def __str__(self):
        return f"{self.user.username} favorited {self.body_part} gallery of {self.contributor.screen_name or self.contributor.user.username}"


class Vote(models.Model):
    """
    Model for tracking votes in contests.
    Users can vote once per contest for a specific participant.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="votes")
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, related_name="votes")
    participant = models.ForeignKey(ContestParticipant, on_delete=models.CASCADE, related_name="votes")
    voted_at = models.DateTimeField(auto_now_add=True)
    consecutive_wins = models.IntegerField(default=0)  # Track consecutive wins for a participant

    class Meta:
        ordering = ['-voted_at']
        verbose_name = "Vote"
        verbose_name_plural = "Votes"
        indexes = [
            models.Index(fields=['contest', 'participant']),
        ]

    def __str__(self):
        return f"{self.user.username} voted for {self.participant.contributor.screen_name} in {self.contest.title}"


class Notification(models.Model):
    """
    Model for tracking notifications to users.
    Notifies users when favorited contributors join contests.
    """
    NOTIFICATION_TYPES = (
        ('favorite_contest_join', 'Favorited Contributor Joined Contest'),
        ('contest_start', 'Contest Started'),
        ('contest_end', 'Contest Ended'),
        ('vote_received', 'Vote Received'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    # Related objects (optional, depending on notification type)
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, null=True, blank=True, related_name="notifications")
    contributor = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True, related_name="related_notifications")
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"