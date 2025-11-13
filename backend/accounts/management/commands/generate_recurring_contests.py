from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import Contest
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Generate recurring contests that are due for creation'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be generated without actually creating contests',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        self.stdout.write(self.style.SUCCESS(
            f'{"[DRY RUN] " if dry_run else ""}Starting recurring contest generation...'
        ))
        
        try:
            # Find all template contests that need generation
            now = timezone.now()
            due_templates = Contest.objects.filter(
                is_recurring_template=True,
                recurring__in=['daily', 'weekly', 'monthly'],
                next_generation_date__lte=now,
                is_active=True
            )
            
            self.stdout.write(f'Found {due_templates.count()} template contests due for generation')
            
            generated_count = 0
            for template in due_templates:
                self.stdout.write(f'Processing template: {template.title} (ID: {template.id})')
                self.stdout.write(f'  - Recurring: {template.recurring}')
                self.stdout.write(f'  - Next generation date: {template.next_generation_date}')
                self.stdout.write(f'  - Start time: {template.start_time}')
                
                if not dry_run:
                    try:
                        new_contest = template.generate_next_recurring_contest()
                        if new_contest:
                            generated_count += 1
                            self.stdout.write(self.style.SUCCESS(
                                f'  ✓ Generated new contest: {new_contest.title} (ID: {new_contest.id})'
                            ))
                            self.stdout.write(f'    - New start time: {new_contest.start_time}')
                            self.stdout.write(f'    - New end time: {new_contest.end_time}')
                            self.stdout.write(f'    - Available from: {new_contest.calculate_available_from_date()}')
                            
                            logger.info(f'Generated recurring contest: {new_contest.title} (ID: {new_contest.id})')
                        else:
                            self.stdout.write(self.style.WARNING(
                                f'  ⚠ Failed to generate contest for template: {template.title}'
                            ))
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(
                            f'  ✗ Error generating contest for template {template.title}: {str(e)}'
                        ))
                        logger.error(f'Error generating recurring contest for template {template.id}: {str(e)}')
                else:
                    # Dry run - just show what would be created
                    from datetime import timedelta
                    from dateutil.relativedelta import relativedelta
                    
                    if template.recurring == "daily":
                        new_start = template.start_time + timedelta(days=1)
                        new_end = template.end_time + timedelta(days=1)
                    elif template.recurring == "weekly":
                        new_start = template.start_time + timedelta(weeks=1)
                        new_end = template.end_time + timedelta(weeks=1)
                    elif template.recurring == "monthly":
                        new_start = template.start_time + relativedelta(months=1)
                        new_end = template.end_time + relativedelta(months=1)
                    
                    self.stdout.write(self.style.SUCCESS(
                        f'  ✓ Would generate: {template.title}'
                    ))
                    self.stdout.write(f'    - Would start: {new_start}')
                    self.stdout.write(f'    - Would end: {new_end}')
                    generated_count += 1
            
            if dry_run:
                self.stdout.write(self.style.SUCCESS(
                    f'[DRY RUN] Would generate {generated_count} recurring contests'
                ))
            else:
                self.stdout.write(self.style.SUCCESS(
                    f'Successfully generated {generated_count} recurring contests'
                ))
                
                # Also check for contests that should now be available for joining
                available_count = Contest.objects.filter(
                    is_active=True,
                    recurring__in=['daily', 'weekly', 'monthly', 'none']
                ).count()
                
                joinable_count = 0
                for contest in Contest.objects.filter(is_active=True):
                    if contest.is_available_for_joining():
                        joinable_count += 1
                        
                self.stdout.write(f'Total active contests: {available_count}')
                self.stdout.write(f'Currently joinable contests: {joinable_count}')
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error during generation: {str(e)}'))
            logger.error(f'Error in generate_recurring_contests command: {str(e)}')
            raise
            
        self.stdout.write(self.style.SUCCESS('Recurring contest generation completed!'))
