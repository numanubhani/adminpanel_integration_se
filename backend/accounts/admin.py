from django.contrib import admin
from .models import *


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

	