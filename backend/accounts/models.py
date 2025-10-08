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