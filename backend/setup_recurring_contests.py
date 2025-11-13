#!/usr/bin/env python
"""
Setup script for recurring contests functionality.
This script helps set up scheduled tasks for automatically generating recurring contests.
"""

import os
import sys
from pathlib import Path

def create_cron_job_script():
    """Create a shell script for cron job"""
    script_content = """#!/bin/bash
# Recurring Contest Generation Script
# This script should be run every hour via cron

# Change to the project directory
cd "$(dirname "$0")"

# Activate virtual environment if needed
# source venv/bin/activate

# Run the management command
python manage.py generate_recurring_contests

# Log the execution
echo "$(date): Recurring contest generation completed" >> recurring_contests.log
"""
    
    script_path = Path(__file__).parent / "generate_recurring_contests.sh"
    with open(script_path, 'w') as f:
        f.write(script_content)
    
    # Make the script executable (on Unix systems)
    try:
        os.chmod(script_path, 0o755)
        print(f"[OK] Created executable script: {script_path}")
    except:
        print(f"[OK] Created script: {script_path} (you may need to make it executable)")

def create_windows_batch_script():
    """Create a Windows batch script for Task Scheduler"""
    batch_content = """@echo off
REM Recurring Contest Generation Batch Script
REM This script should be run every hour via Windows Task Scheduler

REM Change to the project directory
cd /d "%~dp0"

REM Activate virtual environment if needed
REM call venv\\Scripts\\activate

REM Run the management command
python manage.py generate_recurring_contests

REM Log the execution
echo %date% %time%: Recurring contest generation completed >> recurring_contests.log
"""
    
    batch_path = Path(__file__).parent / "generate_recurring_contests.bat"
    with open(batch_path, 'w') as f:
        f.write(batch_content)
    
    print(f"[OK] Created Windows batch script: {batch_path}")

def create_systemd_service():
    """Create a systemd service file template"""
    service_content = """[Unit]
Description=Recurring Contest Generation
After=network.target

[Service]
Type=oneshot
User=www-data
Group=www-data
WorkingDirectory=/path/to/your/project
Environment=DJANGO_SETTINGS_MODULE=backend.settings
ExecStart=/path/to/your/project/venv/bin/python /path/to/your/project/manage.py generate_recurring_contests

[Install]
WantedBy=multi-user.target
"""
    
    service_path = Path(__file__).parent / "recurring-contests.service"
    with open(service_path, 'w') as f:
        f.write(service_content)
    
    print(f"[OK] Created systemd service template: {service_path}")

def create_systemd_timer():
    """Create a systemd timer file"""
    timer_content = """[Unit]
Description=Run Recurring Contest Generation every hour
Requires=recurring-contests.service

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
"""
    
    timer_path = Path(__file__).parent / "recurring-contests.timer"
    with open(timer_path, 'w') as f:
        f.write(timer_content)
    
    print(f"[OK] Created systemd timer: {timer_path}")

def create_documentation():
    """Create documentation for the recurring contest system"""
    doc_content = """# Recurring Contest System Documentation

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
"""
    
    doc_path = Path(__file__).parent / "RECURRING_CONTESTS.md"
    with open(doc_path, 'w') as f:
        f.write(doc_content)
    
    print(f"[OK] Created documentation: {doc_path}")

def main():
    """Main setup function"""
    print("Setting up recurring contests functionality...")
    print("=" * 50)
    
    # Create scripts for different platforms
    create_cron_job_script()
    create_windows_batch_script()
    create_systemd_service()
    create_systemd_timer()
    create_documentation()
    
    print("\n" + "=" * 50)
    print("[SUCCESS] Setup completed!")
    print("\nNext steps:")
    print("1. Run database migration: python manage.py migrate accounts")
    print("2. Choose a scheduling method from RECURRING_CONTESTS.md")
    print("3. Test with: python manage.py generate_recurring_contests --dry-run")
    print("4. Create your first recurring contest in the admin panel")

if __name__ == "__main__":
    main()
