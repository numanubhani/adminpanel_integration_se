#!/bin/bash
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
