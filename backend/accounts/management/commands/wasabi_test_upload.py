"""
Test upload to Wasabi to verify bucket, credentials, and endpoint.
Run: python manage.py wasabi_test_upload
"""
from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.files.base import ContentFile


class Command(BaseCommand):
    help = "Upload a test file to Wasabi (see-media) to verify bucket and credentials."

    def handle(self, *args, **options):
        if not getattr(settings, "USE_WASABI_STORAGE", False):
            self.stdout.write(self.style.ERROR("USE_WASABI_STORAGE is False. Set it in .env and try again."))
            return

        bucket = getattr(settings, "AWS_STORAGE_BUCKET_NAME", "")
        if not bucket:
            self.stdout.write(self.style.ERROR("AWS_STORAGE_BUCKET_NAME is not set."))
            return

        self.stdout.write(f"Bucket: {bucket}")
        self.stdout.write(f"Endpoint: {getattr(settings, 'AWS_S3_ENDPOINT_URL', '')}")
        self.stdout.write("Uploading test file...")

        try:
            from django.core.files.storage import default_storage
            test_key = "profile_pictures/_test_wasabi_upload.txt"
            content = ContentFile(b"Wasabi test upload from Django.")
            saved = default_storage.save(test_key, content)
            self.stdout.write(self.style.SUCCESS(f"Upload OK: {saved}"))
            try:
                default_storage.delete(test_key)
                self.stdout.write("Test file deleted.")
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Could not delete test file: {e}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Upload failed: {e}"))
            self.stdout.write(f"Exception type: {type(e).__name__}")
