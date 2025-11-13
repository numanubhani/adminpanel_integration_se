# Recurring Contest System Documentation

## Overview

The recurring contest system automatically generates new contest instances based on predefined templates with specific advance availability rules:

- **Daily contests**: Available for joining 1 day before start time
- **Weekly contests**: Available for joining 7 days before start time  
- **Monthly contests**: Available for joining 1 month before start time

## How It Works

1. **Template Creation**: When you create a contest with recurring set to "daily", "weekly", or "monthly", it becomes a template (`is_recurring_template=True`)

2. **Automatic Generation**: The system automatically generates new contest instances based on the template schedule

3. **Availability Rules**: Each generated contest becomes available for contributors to join according to the advance period

## Management Commands

### Generate Recurring Contests
```bash
# Generate all due recurring contests
python manage.py generate_recurring_contests

# Dry run to see what would be generated
python manage.py generate_recurring_contests --dry-run
```

## Scheduling Options

### Option 1: Cron Job (Linux/macOS)
```bash
# Add this to your crontab (crontab -e)
0 * * * * /path/to/your/project/generate_recurring_contests.sh
```

### Option 2: Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to "Daily" and repeat every 1 hour
4. Set action to start the `generate_recurring_contests.bat` script

### Option 3: Systemd (Linux)
```bash
# Copy service and timer files to systemd directory
sudo cp recurring-contests.service /etc/systemd/system/
sudo cp recurring-contests.timer /etc/systemd/system/

# Enable and start the timer
sudo systemctl enable recurring-contests.timer
sudo systemctl start recurring-contests.timer

# Check status
sudo systemctl status recurring-contests.timer
```

## Contest Lifecycle

### Daily Contest Example
- Template created: Contest starts 2026-01-02 9:00 PM
- Generated instance: Becomes available 2026-01-01 9:00 PM (24 hours before)
- Next instance: Generated for 2026-01-03 9:00 PM, available 2026-01-02 9:00 PM

### Weekly Contest Example  
- Template created: Contest starts 2026-01-08 9:00 PM
- Generated instance: Becomes available 2026-01-01 9:00 PM (7 days before)
- Next instance: Generated for 2026-01-15 9:00 PM, available 2026-01-08 9:00 PM

### Monthly Contest Example
- Template created: Contest starts 2026-02-01 9:00 PM  
- Generated instance: Becomes available 2026-01-01 9:00 PM (30 days before)
- Next instance: Generated for 2026-03-01 9:00 PM, available 2026-02-01 9:00 PM

## API Changes

### New Contest Fields
- `is_recurring_template`: Boolean indicating if this is a template
- `parent_contest`: Reference to the original template
- `next_generation_date`: When the next instance should be generated
- `available_from`: Calculated field showing when contest becomes joinable
- `is_available_for_joining`: Boolean indicating current availability

### Filtering
- Regular users only see non-template contests that are available for joining
- Admins can see all contests including templates
- Use `?recurring=daily` to filter by recurring type

## Database Migration

Run the migration to add the new fields:
```bash
python manage.py migrate accounts
```

## Testing

Test the system with a dry run:
```bash
python manage.py generate_recurring_contests --dry-run
```

## Monitoring

Check the logs for generation status:
```bash
tail -f recurring_contests.log
```

Monitor in Django admin:
- Templates show in the "Recurring Settings" section
- Generated contests link back to their parent template
- Filter by `is_recurring_template` to see templates vs instances
