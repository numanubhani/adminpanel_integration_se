@echo off
REM Git History Cleanup Script for Windows
REM This script removes secrets from git history
REM WARNING: This rewrites git history. Make sure you have a backup!

echo ⚠️  WARNING: This will rewrite git history!
echo Make sure you have a backup of your repository.
echo.
set /p confirm="Do you want to continue? (yes/no): "

if not "%confirm%"=="yes" (
    echo Aborted.
    exit /b 1
)

echo.
echo 🧹 Cleaning git history...
echo.

REM Check if git-filter-repo is available
where git-filter-repo >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing git-filter-repo...
    pip install git-filter-repo
)

REM Remove files with secrets from git history
echo Removing INTEGRATION_COMPLETE_CHECKLIST.md from history...
git filter-repo --path INTEGRATION_COMPLETE_CHECKLIST.md --invert-paths --force

echo Removing TWILIO_SETUP_GUIDE.md from history...
git filter-repo --path TWILIO_SETUP_GUIDE.md --invert-paths --force

echo Removing .pyc files from history...
git filter-repo --path-glob "*.pyc" --invert-paths --force
git filter-repo --path-glob "__pycache__/**" --invert-paths --force

echo.
echo ⚠️  Note: You may need to manually clean settings.py from history
echo     The old versions with secrets need to be removed.
echo.
echo ✅ Git history cleaned!
echo.
echo 📋 Next steps:
echo 1. Review the changes: git log
echo 2. Add your cleaned settings.py back: git add backend/backend/settings.py
echo 3. Commit: git commit -m "Remove secrets from codebase"
echo 4. Force push: git push origin main --force
echo.
echo ⚠️  IMPORTANT: Rotate your Twilio and YOTI credentials in their dashboards!
pause

