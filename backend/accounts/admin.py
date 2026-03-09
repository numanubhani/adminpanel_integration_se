import uuid
from django.contrib import admin
from django.contrib import messages
from .models import Profile, Payment, BodyPartImage, Admin, Contest, ContestParticipant, SmokeSignal, FavoriteImage, Vote, Notification, AgeVerification


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
	list_display = (
		"user",
		"role",
		"legal_full_name",
		"screen_name",
		"date_of_birth",
		"age",
		"phone_number",
		"w9_unique_id",
		"w9_completed",
		"w9_completion_date",
		"id_document",
	)
	search_fields = ("user__username", "user__email", "legal_full_name", "screen_name", "phone_number", "w9_unique_id")
	list_filter = ("role", "is_over_18", "w9_completed")
	readonly_fields = ("id_document",)
	actions = ("generate_w9_unique_id_action",)
	fieldsets = (
		(None, {
			"fields": ("user", "role", "legal_full_name", "screen_name", "date_of_birth", "age", "phone_number")
		}),
		("W-9 Tax Form (TaxZerone)", {
			"fields": ("w9_unique_id", "w9_completed", "w9_completion_date", "w9_data"),
			"description": "Generate ID: select this profile on the list, use action 'Generate W-9 unique ID', or have the contributor call POST /api/accounts/profile/w9/generate-unique-id/."
		}),
		("Address & location", {
			"fields": ("address", "city", "state", "zip_code", "country", "country_residence", "nationality")
		}),
		("Other", {
			"fields": ("id_document", "profile_picture", "card_number", "is_over_18", "bio", "name_visibility",
				"occupation", "creator_pathway", "first_name", "last_name", "gender", "height", "weight",
				"shoe_size", "skin_tone", "hair_color", "body_type", "penis_length", "female_body_type",
				"bust_size", "milf", "active_profile_image")
		}),
	)

	@admin.action(description="Generate W-9 unique ID")
	def generate_w9_unique_id_action(self, request, queryset):
		updated = 0
		for profile in queryset:
			if not profile.w9_unique_id:
				profile.w9_unique_id = str(uuid.uuid4())
				profile.save(update_fields=["w9_unique_id"])
				updated += 1
		if updated:
			self.message_user(request, f"Generated W-9 unique ID for {updated} profile(s).", messages.SUCCESS)
		else:
			self.message_user(request, "No profiles needed an ID (all selected already had one).", messages.WARNING)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
	list_display = (
		"user",
		"card_number",
		"amount",
		"status",
		"created_at",
	)
	search_fields = ("user__username", "user__email", "card_number")
	list_filter = ("status", "created_at")
	readonly_fields = ("created_at", "updated_at")


# accounts/admin.py
from django.contrib import admin
from .models import BodyPartImage

@admin.register(BodyPartImage)
class BodyPartImageAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "body_part", "image", "created_at")
    list_filter = ("body_part", "created_at")
    search_fields = ("user__email", "body_part")
    readonly_fields = ("created_at",)  # ✅ only existing fields

    def image_tag(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="100" height="100" style="object-fit:cover;" />'
        return "No Image"
    image_tag.allow_tags = True
    image_tag.short_description = "Preview"


@admin.register(Admin)
class AdminAdmin(admin.ModelAdmin):
    list_display = ("id", "get_email", "is_admin", "created_at", "updated_at")
    list_filter = ("is_admin", "created_at")
    search_fields = ("profile__user__email", "profile__user__username")
    readonly_fields = ("created_at", "updated_at")
    
    def get_email(self, obj):
        return obj.profile.user.email
    get_email.short_description = "Email"
    get_email.admin_order_field = "profile__user__email"


@admin.register(Contest)
class ContestAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "joined", "max_participants", "start_time", "end_time", "recurring", "is_recurring_template", "is_active", "created_by")
    list_filter = ("category", "is_active", "recurring", "is_recurring_template", "created_at")
    search_fields = ("title", "category")
    readonly_fields = ("created_at", "updated_at", "joined", "next_generation_date")
    fieldsets = (
        ("Basic Info", {
            "fields": ("title", "category", "image", "is_active")
        }),
        ("Attributes", {
            "fields": ("attributes",)
        }),
        ("Participants", {
            "fields": ("joined", "max_participants")
        }),
        ("Schedule", {
            "fields": ("start_time", "end_time", "recurring")
        }),
        ("Recurring Settings", {
            "fields": ("is_recurring_template", "parent_contest", "next_generation_date"),
            "description": "Recurring contest configuration. Templates generate new contests automatically."
        }),
        ("Payment", {
            "fields": ("cost",)
        }),
        ("Meta", {
            "fields": ("created_by", "created_at", "updated_at")
        }),
    )


@admin.register(ContestParticipant)
class ContestParticipantAdmin(admin.ModelAdmin):
    list_display = ("id", "get_contest_title", "get_contributor_name", "joined_at", "auto_entry")
    list_filter = ("auto_entry", "joined_at")
    search_fields = ("contest__title", "contributor__screen_name", "contributor__user__email")
    readonly_fields = ("joined_at",)
    
    def get_contest_title(self, obj):
        return obj.contest.title
    get_contest_title.short_description = "Contest"
    get_contest_title.admin_order_field = "contest__title"
    
    def get_contributor_name(self, obj):
        return obj.contributor.screen_name or obj.contributor.user.email
    get_contributor_name.short_description = "Contributor"
    get_contributor_name.admin_order_field = "contributor__screen_name"


@admin.register(SmokeSignal)
class SmokeSignalAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'channel', 'status', 'timestamp', 'message')
    list_filter = ('channel', 'status', 'timestamp')
    search_fields = ('sender', 'recipient', 'message')
    readonly_fields = ('timestamp',)
    ordering = ('-timestamp',)


@admin.register(FavoriteImage)
class FavoriteImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_user_email', 'get_body_part', 'get_contributor', 'created_at')
    list_filter = ('created_at', 'body_part_image__body_part')
    search_fields = ('user__username', 'user__email', 'body_part_image__user__email', 'body_part_image__body_part')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    
    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = "User"
    get_user_email.admin_order_field = "user__email"
    
    def get_body_part(self, obj):
        return obj.body_part_image.body_part
    get_body_part.short_description = "Body Part"
    get_body_part.admin_order_field = "body_part_image__body_part"
    
    def get_contributor(self, obj):
        return obj.body_part_image.user.email
    get_contributor.short_description = "Contributor"
    get_contributor.admin_order_field = "body_part_image__user__email"


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_voter_email', 'get_contest_title', 'get_participant_name', 'voted_at')
    list_filter = ('voted_at', 'contest')
    search_fields = ('user__username', 'user__email', 'contest__title', 'participant__contributor__screen_name')
    readonly_fields = ('voted_at',)
    ordering = ('-voted_at',)
    
    def get_voter_email(self, obj):
        return obj.user.email
    get_voter_email.short_description = "Voter"
    get_voter_email.admin_order_field = "user__email"
    
    def get_contest_title(self, obj):
        return obj.contest.title
    get_contest_title.short_description = "Contest"
    get_contest_title.admin_order_field = "contest__title"
    
    def get_participant_name(self, obj):
        return obj.participant.contributor.screen_name or obj.participant.contributor.user.email
    get_participant_name.short_description = "Voted For"
    get_participant_name.admin_order_field = "participant__contributor__screen_name"


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_user_email', 'notification_type', 'title', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('user__username', 'user__email', 'title', 'message')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    
    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = "User"
    get_user_email.admin_order_field = "user__email"


@admin.register(AgeVerification)
class AgeVerificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_user_email', 'age', 'is_over_18', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'is_over_18', 'created_at')
    search_fields = ('user__username', 'user__email', 'token')
    readonly_fields = ('created_at', 'updated_at', 'verification_response')
    ordering = ('-created_at',)
    
    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = "User"
    get_user_email.admin_order_field = "user__email"