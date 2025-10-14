from django.contrib import admin
from .models import Profile, Payment, BodyPartImage, Admin, Contest, ContestParticipant, SmokeSignal


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
		"id_document",
	)
	search_fields = ("user__username", "user__email", "legal_full_name", "screen_name", "phone_number")
	list_filter = ("role", "is_over_18")
	readonly_fields = ("id_document",)


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
    list_display = ("id", "title", "category", "joined", "max_participants", "start_time", "end_time", "is_active", "created_by")
    list_filter = ("category", "is_active", "recurring", "created_at")
    search_fields = ("title", "category")
    readonly_fields = ("created_at", "updated_at", "joined")
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