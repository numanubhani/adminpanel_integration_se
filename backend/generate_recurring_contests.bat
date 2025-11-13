@echo off
REM Recurring Contest Generation Batch Script
REM This script should be run every hour via Windows Task Scheduler

REM Change to the project directory
cd /d "%~dp0"

REM Activate virtual environment if needed
REM call venv\Scripts\activate

REM Run the management command
python manage.py generate_recurring_contests

REM Log the execution
echo %date% %time%: Recurring contest generation completed >> recurring_contests.log
