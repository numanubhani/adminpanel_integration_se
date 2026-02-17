from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Payment, BodyPartImage, Admin, Contest, ContestParticipant, SmokeSignal, FavoriteImage, FavoriteGallery, Vote, Notification, AgeVerification


# ── Register (role-aware)
class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=("contributor", "user"))
    screenName = serializers.CharField(source="screen_name", required=False, allow_blank=True, max_length=17)

    def validate_email(self, value):
        if User.objects.filter(username=value).exists() or User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

    def validate(self, attrs):
        """
        Ensure screen names are unique across all profiles when provided.
        """
        screen_name = attrs.get("screen_name") or ""
        if screen_name:
            if Profile.objects.filter(screen_name__iexact=screen_name).exists():
                raise serializers.ValidationError(
                    {"screenName": "This screen name is already in use. Please choose another."}
                )
        return attrs

    def create(self, validated_data):
        email = validated_data["email"].lower()
        password = validated_data["password"]
        role = validated_data.get("role", "user")
        screen_name = validated_data.get("screen_name", "")

        user = User.objects.create_user(username=email, email=email, password=password)
        Profile.objects.create(user=user, role=role, screen_name=screen_name)
        return user


# ── Profile (basic user GET/PATCH)
class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", required=False)
    username = serializers.CharField(source="user.username", read_only=True)
    screen_name = serializers.CharField(required=False, max_length=17)
    password = serializers.CharField(write_only=True, required=False)
    profile_picture = serializers.SerializerMethodField()
    active_profile_image_id = serializers.IntegerField(source="active_profile_image.id", read_only=True, allow_null=True)
    card_number = serializers.CharField(required=False, allow_blank=True)
    w9_completed = serializers.BooleanField(read_only=True)
    w9_unique_id = serializers.CharField(read_only=True)
    w9_completion_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Profile
        fields = "__all__"
        read_only_fields = ("role",)
    
    def get_profile_picture(self, obj):
        """Return full URL for profile picture"""
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

    def update(self, instance, validated_data):
        # nested user (email)
        user_data = validated_data.pop("user", {})
        if "email" in user_data:
            email = user_data["email"]
            instance.user.email = email
            instance.user.username = email  # keep in sync
            instance.user.save()

        # password
        password = validated_data.pop("password", None)
        if password:
            instance.user.set_password(password)
            instance.user.save()

        # Handle profile_picture from request.FILES if present
        request = self.context.get('request')
        if request and 'profile_picture' in request.FILES:
            instance.profile_picture = request.FILES['profile_picture']
        
        # Handle setting profile picture from existing gallery image
        if request and 'profile_picture_from_gallery' in request.data:
            from .models import BodyPartImage
            from django.core.files.base import ContentFile
            import os
            
            try:
                body_part_image_id = int(request.data.get('profile_picture_from_gallery'))
                body_part_image = BodyPartImage.objects.get(
                    id=body_part_image_id,
                    user=request.user
                )
                
                # Track which gallery image is the active profile picture
                instance.active_profile_image = body_part_image
                
                # Copy the image file to profile_picture
                if body_part_image.image:
                    # Read the image content
                    image_content = body_part_image.image.read()
                    # Get original filename
                    original_filename = os.path.basename(body_part_image.image.name)
                    # Save to profile_picture field
                    instance.profile_picture.save(
                        original_filename,
                        ContentFile(image_content),
                        save=False
                    )
            except (BodyPartImage.DoesNotExist, ValueError):
                pass  # Silently fail if image not found

        # profile fields (incl. id_document via multipart)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


# ── User register (simple)
class UserRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    screenName = serializers.CharField(source="screen_name", required=False, allow_blank=True, max_length=17)

    def validate_email(self, value):
        if User.objects.filter(username=value).exists() or User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

    def validate(self, attrs):
        """
        Ensure screen names are unique across all profiles when provided.
        """
        screen_name = attrs.get("screen_name") or ""
        if screen_name:
            if Profile.objects.filter(screen_name__iexact=screen_name).exists():
                raise serializers.ValidationError(
                    {"screenName": "This screen name is already in use. Please choose another."}
                )
        return attrs

    def create(self, validated_data):
        email = validated_data["email"].lower()
        password = validated_data["password"]
        screen_name = validated_data.get("screen_name", "")

        user = User.objects.create_user(username=email, email=email, password=password)
        Profile.objects.create(user=user, role="user", screen_name=screen_name)
        return user


# ── Contributor register (extended)
class ContributorRegisterSerializer(serializers.Serializer):
    # Core account
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    screenName = serializers.CharField(source="screen_name", required=False, allow_blank=True, max_length=17)
    legalFullName = serializers.CharField(source="legal_full_name", required=False, allow_blank=True)
    allowNameInSearch = serializers.BooleanField(source="allow_name_in_search", required=False)
    creatorPathway = serializers.CharField(source="creator_pathway", required=False, allow_blank=True)

    # Basic info
    firstName = serializers.CharField(source="first_name", required=False, allow_blank=True)
    lastName = serializers.CharField(source="last_name", required=False, allow_blank=True)
    phoneNumber = serializers.CharField(source="phone_number", required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    zipCode = serializers.CharField(source="zip_code", required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    countryResidence = serializers.CharField(source="country_residence", required=False, allow_blank=True)
    nationality = serializers.CharField(required=False, allow_blank=True)
    occupation = serializers.CharField(required=False, allow_blank=True)

    # Visibility & DOB/Age
    nameVisibility = serializers.CharField(source="name_visibility", required=False, allow_blank=True)
    isOver18 = serializers.BooleanField(source="is_over_18", required=False)
    bio = serializers.CharField(required=False, allow_blank=True)
    dateOfBirth = serializers.DateField(source="date_of_birth", required=False, allow_null=True)
    age = serializers.IntegerField(required=False, allow_null=True)

    # Contributor details
    gender = serializers.ChoiceField(choices=("Male", "Female", "Other"), required=False)
    height = serializers.CharField(required=False, allow_blank=True)
    weight = serializers.CharField(required=False, allow_blank=True)
    shoeSize = serializers.CharField(source="shoe_size", required=False, allow_blank=True)
    skinTone = serializers.CharField(source="skin_tone", required=False, allow_blank=True)
    hairColor = serializers.CharField(source="hair_color", required=False, allow_blank=True)

    # Male-specific
    bodyType = serializers.CharField(source="body_type", required=False, allow_blank=True)
    penisLength = serializers.CharField(source="penis_length", required=False, allow_blank=True)

    # Female-specific
    femaleBodyType = serializers.CharField(source="female_body_type", required=False, allow_blank=True)
    bustSize = serializers.CharField(source="bust_size", required=False, allow_blank=True)
    milf = serializers.CharField(required=False, allow_blank=True)

    # ID Document upload
    idDocument = serializers.FileField(source="id_document", required=False, allow_null=True)

    def validate_email(self, value):
        if User.objects.filter(username=value).exists() or User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

    def validate(self, attrs):
        """
        Ensure screen names are unique across all profiles when provided.
        """
        screen_name = attrs.get("screen_name") or ""
        if screen_name:
            if Profile.objects.filter(screen_name__iexact=screen_name).exists():
                raise serializers.ValidationError(
                    {"screenName": "This screen name is already in use. Please choose another."}
                )
        return attrs

    def create(self, validated_data):
        email = validated_data.pop("email").lower()
        password = validated_data.pop("password")
        user = User.objects.create_user(username=email, email=email, password=password)
        Profile.objects.create(user=user, role="contributor", **validated_data)
        return user


# ── Contributor profile (GET/PATCH full contributor fields)
class ContributorProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Profile
        fields = [
            "id",
            "email",
            "password",
            "screen_name",
            "legal_full_name",
            "allow_name_in_search",
            "creator_pathway",
            "first_name",
            "last_name",
            "phone_number",
            "address",
            "city",
            "state",
            "zip_code",
            "country",
            "country_residence",
            "nationality",
            "occupation",
            "name_visibility",
            "is_over_18",
            "bio",
            "date_of_birth",
            "age",
            "gender",
            "height",
            "weight",
            "shoe_size",
            "skin_tone",
            "hair_color",
            "body_type",
            "penis_length",
            "female_body_type",
            "bust_size",
            "milf",
            "id_document",
            "role",
        ]
        read_only_fields = ("role",)

    def update(self, instance, validated_data):
        # nested user (email)
        user_data = validated_data.pop("user", {})
        if "email" in user_data:
            email = user_data["email"]
            instance.user.email = email
            instance.user.username = email
            instance.user.save()

        # password
        password = validated_data.pop("password", None)
        if password:
            instance.user.set_password(password)
            instance.user.save()

        # all contributor profile fields (incl. id_document via multipart)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


# ── Add Funds
class AddFundsSerializer(serializers.ModelSerializer):
    cardNumber = serializers.CharField(source="card_number", max_length=20)
    expiryDate = serializers.CharField(source="expiry_date", max_length=10)
    securityCode = serializers.CharField(source="security_code", max_length=4)

    class Meta:
        model = Payment
        fields = ["cardNumber", "expiryDate", "securityCode"]

    def validate_cardNumber(self, value):
        if not value:
            raise serializers.ValidationError("Card number is required")
        cleaned = value.replace(" ", "").replace("-", "")
        if not cleaned.isdigit():
            raise serializers.ValidationError("Card number must contain only digits")
        if len(cleaned) < 13 or len(cleaned) > 19:
            raise serializers.ValidationError("Card number must be between 13-19 digits")
        return cleaned

    def validate_expiryDate(self, value):
        if not value:
            raise serializers.ValidationError("Expiry date is required")
        if "/" not in value:
            raise serializers.ValidationError("Expiry date must be in MM/YYYY format")
        try:
            month, year = value.split("/")
            if not month.isdigit() or not year.isdigit():
                raise serializers.ValidationError("Expiry date must contain only digits")
            if int(month) < 1 or int(month) > 12:
                raise serializers.ValidationError("Invalid month")
            if len(year) != 4:
                raise serializers.ValidationError("Year must be 4 digits")
        except ValueError:
            raise serializers.ValidationError("Invalid expiry date format")
        return value

    def validate_securityCode(self, value):
        if not value:
            raise serializers.ValidationError("Security code is required")
        if not value.isdigit():
            raise serializers.ValidationError("Security code must contain only digits")
        if len(value) < 3 or len(value) > 4:
            raise serializers.ValidationError("Security code must be 3-4 digits")
        return value

    def create(self, validated_data):
        card_number = validated_data.get("card_number", "")
        masked_card = (
            "****-****-****-" + card_number[-4:] if len(card_number) >= 4 else "****-****-****-****"
        )
        validated_data["card_number"] = masked_card
        return super().create(validated_data)


# ── Body Part Image
class BodyPartImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    is_in_contest = serializers.SerializerMethodField()
    
    class Meta:
        model = BodyPartImage
        fields = ["id", "body_part", "image", "image_url", "created_at", "is_in_contest"]
    
    def get_image_url(self, obj):
        """Return full URL for the image"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_is_in_contest(self, obj):
        """Check if this image is being used in any active contest"""
        return obj.contest_submissions.exists()


# ── Favorite Image
class FavoriteImageSerializer(serializers.ModelSerializer):
    """
    Serializer for favorite images.
    Returns the favorited image details along with contributor information.
    """
    image_url = serializers.SerializerMethodField()
    body_part = serializers.CharField(source='body_part_image.body_part', read_only=True)
    contributor_name = serializers.CharField(source='body_part_image.user.username', read_only=True)
    contributor_screen_name = serializers.SerializerMethodField()
    contributor_id = serializers.SerializerMethodField()
    body_part_image_id = serializers.IntegerField(source='body_part_image.id', read_only=True)
    
    class Meta:
        model = FavoriteImage
        fields = [
            'id', 
            'body_part_image_id',
            'body_part', 
            'image_url', 
            'contributor_name', 
            'contributor_screen_name',
            'contributor_id',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_image_url(self, obj):
        """Return full URL for the favorited image"""
        if obj.body_part_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.body_part_image.image.url)
            return obj.body_part_image.image.url
        return None
    
    def get_contributor_screen_name(self, obj):
        """Return contributor's screen name if available"""
        try:
            profile = obj.body_part_image.user.profile
            return profile.screen_name if profile.screen_name else obj.body_part_image.user.username
        except:
            return obj.body_part_image.user.username
    
    def get_contributor_id(self, obj):
        """Return contributor's profile ID"""
        try:
            profile = obj.body_part_image.user.profile
            return profile.id
        except:
            return None


class AddFavoriteSerializer(serializers.Serializer):
    """
    Serializer for adding an image to favorites.
    Only requires the body_part_image_id.
    """
    body_part_image_id = serializers.IntegerField()
    
    def validate_body_part_image_id(self, value):
        """Validate that the body part image exists"""
        if not BodyPartImage.objects.filter(id=value).exists():
            raise serializers.ValidationError("Body part image does not exist")
        return value


class FavoriteGallerySerializer(serializers.ModelSerializer):
    """
    Serializer for favorite galleries (contributor + body part).
    """
    contributor_name = serializers.SerializerMethodField()
    contributor_screen_name = serializers.SerializerMethodField()

    class Meta:
        model = FavoriteGallery
        fields = ['id', 'contributor', 'contributor_name', 'contributor_screen_name', 'body_part', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_contributor_name(self, obj):
        return obj.contributor.legal_full_name or obj.contributor.user.username

    def get_contributor_screen_name(self, obj):
        return obj.contributor.screen_name or obj.contributor.user.username


# ── Vote
class VoteSerializer(serializers.ModelSerializer):
    """
    Serializer for votes.
    """
    participant_name = serializers.CharField(source='participant.contributor.screen_name', read_only=True)
    contest_title = serializers.CharField(source='contest.title', read_only=True)
    
    class Meta:
        model = Vote
        fields = ['id', 'user', 'contest', 'contest_title', 'participant', 'participant_name', 'loser', 'consecutive_wins', 'voted_at']
        read_only_fields = ['id', 'user', 'voted_at']


class CastVoteSerializer(serializers.Serializer):
    """
    Serializer for casting a vote.
    """
    participant_id = serializers.IntegerField()
    
    def validate_participant_id(self, value):
        """Validate that the participant exists"""
        if not ContestParticipant.objects.filter(id=value).exists():
            raise serializers.ValidationError("Participant does not exist")
        return value


# ── Notification
class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for notifications.
    """
    contest_title = serializers.CharField(source='contest.title', read_only=True, allow_null=True)
    contest_id = serializers.IntegerField(source='contest.id', read_only=True, allow_null=True)
    contributor_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message', 
            'contest', 'contest_id', 'contest_title',
            'contributor', 'contributor_name',
            'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_contributor_name(self, obj):
        """Return contributor's screen name if available"""
        if obj.contributor:
            return obj.contributor.screen_name or obj.contributor.user.username
        return None


# ══════════════════════════════════════════════════════════════════════
# ADMIN SERIALIZERS
# ══════════════════════════════════════════════════════════════════════

class AdminSerializer(serializers.ModelSerializer):
    """
    Admin serializer for responses - shows email, screen name, and admin status.
    """
    email = serializers.EmailField(source='profile.user.email', read_only=True)
    screen_name = serializers.CharField(source='profile.screen_name', read_only=True, required=False)
    
    class Meta:
        model = Admin
        fields = ['id', 'email', 'screen_name', 'is_admin', 'created_at', 'updated_at']
        read_only_fields = ['id', 'email', 'screen_name', 'is_admin', 'created_at', 'updated_at']


# ══════════════════════════════════════════════════════════════════════
# CONTEST SERIALIZERS
# ══════════════════════════════════════════════════════════════════════

class ContestSerializer(serializers.ModelSerializer):
    """
    Contest serializer for full CRUD operations.
    Used by admin to create/edit contests and by users/contributors to view contests.
    """
    created_by_name = serializers.CharField(source='created_by.profile.screen_name', read_only=True)
    joined = serializers.SerializerMethodField()
    participants_count = serializers.SerializerMethodField()
    user_participants_count = serializers.SerializerMethodField()
    contributor_participants_count = serializers.SerializerMethodField()
    estimated_prize = serializers.SerializerMethodField()
    available_from = serializers.SerializerMethodField()
    is_available_for_joining = serializers.SerializerMethodField()
    
    class Meta:
        model = Contest
        fields = [
            'id', 'title', 'category', 'image', 'attributes', 
            'joined', 'participants_count', 'user_participants_count', 'contributor_participants_count', 
            'max_participants', 'start_time', 'end_time', 
            'recurring', 'parent_contest', 'next_generation_date', 'is_recurring_template',
            'available_from', 'is_available_for_joining', 'cost', 'estimated_prize', 'is_active', 
            'created_by', 'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_by', 'created_by_name', 'created_at', 'updated_at',
            'next_generation_date', 'available_from', 'is_available_for_joining'
        ]
    
    def get_joined(self, obj):
        """Count total participants (both users and contributors) joined this contest"""
        return obj.participants.count()
    
    def get_participants_count(self, obj):
        """Count total participants (both users and contributors) joined this contest"""
        return obj.participants.count()
    
    def get_user_participants_count(self, obj):
        """Count only users (judges/voters) who joined this contest"""
        return obj.participants.filter(contributor__role='user').count()
    
    def get_contributor_participants_count(self, obj):
        """Count only contributors (participants) who joined this contest"""
        return obj.participants.filter(contributor__role='contributor').count()
    
    def get_estimated_prize(self, obj):
        """
        Calculate estimated prize as 75% of total user entry fees.
        Formula: (number_of_user_participants * cost_per_entry) * 0.75
        
        Note: Only counts users (role='user') who paid to join, not contributors.
        Contributors join for free and compete for the prize.
        """
        # Count only users (judges/voters) who paid to join, not contributors
        user_participants = obj.participants.filter(contributor__role='user').count()
        
        # Calculate total pot (user participants * cost per entry)
        total_pot = float(user_participants) * float(obj.cost)
        
        # Prize is 75% of total pot
        estimated_prize = total_pot * 0.75
        
        return round(estimated_prize, 2)
    
    def get_available_from(self, obj):
        """Get the date when this contest becomes available for joining"""
        return obj.calculate_available_from_date()
    
    def get_is_available_for_joining(self, obj):
        """Check if this contest is currently available for joining"""
        return obj.is_available_for_joining()
    
    def validate(self, data):
        """Validate that end_time is after start_time"""
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        
        if start_time and end_time and end_time <= start_time:
            raise serializers.ValidationError("End time must be after start time")
        
        return data


class ContestParticipantSerializer(serializers.ModelSerializer):
    """
    Serializer for contest participants.
    Shows which contributors have joined which contests.
    """
    contributor_name = serializers.CharField(source='contributor.screen_name', read_only=True)
    contributor_email = serializers.EmailField(source='contributor.user.email', read_only=True)
    contest_title = serializers.CharField(source='contest.title', read_only=True)
    body_part_image_id = serializers.IntegerField(source='body_part_image.id', read_only=True, allow_null=True)
    body_part_image_url = serializers.SerializerMethodField()
    votes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ContestParticipant
        fields = [
            'id', 'contest', 'contest_title', 'contributor', 
            'contributor_name', 'contributor_email', 
            'body_part_image', 'body_part_image_id', 'body_part_image_url',
            'votes_count', 'joined_at', 'auto_entry'
        ]
        read_only_fields = ['id', 'joined_at', 'body_part_image', 'votes_count']
    
    def get_body_part_image_url(self, obj):
        """Return full URL for the body part image"""
        if obj.body_part_image and obj.body_part_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.body_part_image.image.url)
            return obj.body_part_image.image.url
        return None
    
    def get_votes_count(self, obj):
        """Return the total number of votes for this participant"""
        return obj.votes.count()


class ContestParticipantDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for contest participants with contributor attributes.
    Used for admin panel to display full contributor information.
    """
    contributor_name = serializers.CharField(source='contributor.screen_name', read_only=True)
    name = serializers.CharField(source='contributor.screen_name', read_only=True)  # Alias for frontend
    contributor_email = serializers.EmailField(source='contributor.user.email', read_only=True)
    contest_title = serializers.CharField(source='contest.title', read_only=True)
    body_part_image_id = serializers.IntegerField(source='body_part_image.id', read_only=True, allow_null=True)
    body_part_image_url = serializers.SerializerMethodField()
    votes_count = serializers.SerializerMethodField()
    attributes = serializers.SerializerMethodField()
    
    class Meta:
        model = ContestParticipant
        fields = [
            'id', 'contest', 'contest_title', 'contributor', 
            'contributor_name', 'name', 'contributor_email', 
            'body_part_image', 'body_part_image_id', 'body_part_image_url',
            'votes_count', 'joined_at', 'auto_entry', 'attributes'
        ]
        read_only_fields = ['id', 'joined_at', 'body_part_image', 'votes_count', 'attributes']
    
    def get_body_part_image_url(self, obj):
        """Return full URL for the body part image"""
        if obj.body_part_image and obj.body_part_image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.body_part_image.image.url)
            return obj.body_part_image.image.url
        return None
    
    def get_votes_count(self, obj):
        """Return the total number of votes for this participant"""
        return obj.votes.count()
    
    def get_attributes(self, obj):
        """Return contributor's profile attributes with complete data"""
        try:
            # Ensure we have the contributor profile loaded
            if not hasattr(obj, 'contributor') or not obj.contributor:
                return self._empty_attributes()
            
            profile = obj.contributor
            
            # Refresh from database to ensure we have latest data
            try:
                profile.refresh_from_db()
            except:
                pass
            
            # Get all profile attributes
            gender = profile.gender or ''
            age = self._get_age_range(profile.age) if profile.age else ''
            skin_tone = profile.skin_tone or ''
            body_type = profile.body_type or profile.female_body_type or ''
            hair_color = profile.hair_color or ''
            bust_size = profile.bust_size or ''
            shoe_size = profile.shoe_size or ''
            penis_size = profile.penis_length or ''
            
            attributes = {
                'Gender': gender,
                'Age': age,
                'Skin Tone': skin_tone,
                'Body Type': body_type,
                'Hair Color': hair_color,
                'Bust Size': bust_size,
                'Shoe Size': shoe_size,
                'Penis Size': penis_size,
            }
            
            # Debug logging
            print(f"DEBUG: Contributor {profile.id} ({profile.screen_name}) attributes: {attributes}")
            
            return attributes
        except Exception as e:
            import traceback
            print(f"ERROR getting attributes for participant {obj.id}: {str(e)}")
            print(traceback.format_exc())
            return self._empty_attributes()
    
    def _empty_attributes(self):
        """Return empty attributes structure"""
        return {
            'Gender': '',
            'Age': '',
            'Skin Tone': '',
            'Body Type': '',
            'Hair Color': '',
            'Bust Size': '',
            'Shoe Size': '',
            'Penis Size': '',
        }
    
    def _get_age_range(self, age):
        """Convert numeric age to age range"""
        if not age:
            return ''
        if age <= 21:
            return '18-21'
        elif age <= 25:
            return '22-25'
        elif age <= 29:
            return '26-29'
        elif age <= 34:
            return '30-34'
        elif age <= 40:
            return '35-40'
        else:
            return '40+'


class ContestDetailSerializer(serializers.ModelSerializer):
    """
    Detailed contest serializer that includes participants list.
    Used for single contest view with all details.
    """
    created_by_name = serializers.CharField(source='created_by.profile.screen_name', read_only=True)
    participants_list = ContestParticipantSerializer(source='participants', many=True, read_only=True)
    participants_count = serializers.SerializerMethodField()
    estimated_prize = serializers.SerializerMethodField()
    user_entries_count = serializers.SerializerMethodField()
    available_from = serializers.SerializerMethodField()
    is_available_for_joining = serializers.SerializerMethodField()
    
    class Meta:
        model = Contest
        fields = [
            'id', 'title', 'category', 'image', 'attributes', 
            'joined', 'max_participants', 'start_time', 'end_time', 
            'recurring', 'parent_contest', 'next_generation_date', 'is_recurring_template',
            'available_from', 'is_available_for_joining', 'cost', 'estimated_prize', 'user_entries_count', 'is_active', 
            'created_by', 'created_by_name', 'created_at', 'updated_at',
            'participants_list', 'participants_count'
        ]
        read_only_fields = [
            'id', 'created_by', 'created_by_name', 'created_at', 'updated_at', 
            'participants_list', 'participants_count', 'next_generation_date', 
            'available_from', 'is_available_for_joining'
        ]
    
    def get_participants_count(self, obj):
        """Count total participants (both users and contributors) joined this contest"""
        return obj.participants.count()
    
    def get_user_entries_count(self, obj):
        """Count unique users who voted (entered) in this contest"""
        from .models import Vote
        return Vote.objects.filter(contest=obj).values('user').distinct().count()
    
    def get_estimated_prize(self, obj):
        """
        Calculate estimated prize as 75% of total user entry fees.
        Formula: (number_of_user_participants * cost_per_entry) * 0.75
        
        Note: Only counts users (role='user') who paid to join, not contributors.
        Contributors join for free and compete for the prize.
        """
        # Count only users (judges/voters) who paid to join, not contributors
        user_participants = obj.participants.filter(contributor__role='user').count()
        
        # Calculate total pot (user participants * cost per entry)
        total_pot = float(user_participants) * float(obj.cost)
        
        # Prize is 75% of total pot
        estimated_prize = total_pot * 0.75
        
        return round(estimated_prize, 2)
    
    def get_available_from(self, obj):
        """Get the date when this contest becomes available for joining"""
        return obj.calculate_available_from_date()
    
    def get_is_available_for_joining(self, obj):
        """Check if this contest is currently available for joining"""
        return obj.is_available_for_joining()


# ══════════════════════════════════════════════════════════════════════
# SMOKE SIGNAL SERIALIZER
# ══════════════════════════════════════════════════════════════════════
class SmokeSignalSerializer(serializers.ModelSerializer):
    """
    Serializer for Smoke Signal notifications.
    Tracks Email and SMS communications sent by the system.
    """
    class Meta:
        model = SmokeSignal
        fields = ['id', 'sender', 'recipient', 'channel', 'status', 'timestamp', 'message']
        read_only_fields = ['id', 'timestamp']

# ══════════════════════════════════════════════════════════════════════
# DASHBOARD STATISTICS SERIALIZER
# ══════════════════════════════════════════════════════════════════════

# ══════════════════════════════════════════════════════════════════════
# AGE VERIFICATION SERIALIZERS
# ══════════════════════════════════════════════════════════════════════

class AgeVerificationRequestSerializer(serializers.Serializer):
    """Serializer for age verification request"""
    token = serializers.CharField(required=True, help_text="Yoti verification token from frontend")


class AgeVerificationResponseSerializer(serializers.Serializer):
    """Serializer for age verification response"""
    success = serializers.BooleanField()
    age = serializers.IntegerField(allow_null=True)
    is_over_18 = serializers.BooleanField()
    date_of_birth = serializers.DateField(allow_null=True, required=False)
    error = serializers.CharField(allow_null=True, required=False)


class AgeVerificationSerializer(serializers.ModelSerializer):
    """Serializer for AgeVerification model"""
    class Meta:
        model = AgeVerification
        fields = ['id', 'user', 'age', 'date_of_birth', 'is_over_18', 'is_verified', 
                  'error_message', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class DashboardStatsSerializer(serializers.Serializer):
    """
    Serializer for admin dashboard statistics.
    Shows overview of users, contributors, and wallet deposits.
    """
    total_contributors = serializers.IntegerField(read_only=True)
    total_users = serializers.IntegerField(read_only=True)
    total_wallet_deposits = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_payments = serializers.IntegerField(read_only=True)
    recent_contributors = serializers.IntegerField(read_only=True, help_text="Contributors joined in last 30 days")
    recent_users = serializers.IntegerField(read_only=True, help_text="Users joined in last 30 days")
    active_contests = serializers.IntegerField(read_only=True)
