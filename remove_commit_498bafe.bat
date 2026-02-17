@echo off
REM Remove specific commit 498bafe72aceb19c19f646ed8a554d66a4ca7b63 from git history
REM This commit contains Twilio secrets that need to be removed

echo ⚠️  WARNING: This will rewrite git history!
echo This will remove commit 498bafe72aceb19c19f646ed8a554d66a4ca7b63
echo Make sure you have a backup of your repository.
echo.
set /p confirm="Do you want to continue? (yes/no): "

if not "%confirm%"=="yes" (
    echo Aborted.
    exit /b 1
)

echo.
echo 🧹 Removing commit 498bafe72aceb19c19f646ed8a554d66a4ca7b63 from history...
echo.

REM Check if git-filter-repo is available
where git-filter-repo >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing git-filter-repo...
    pip install git-filter-repo
)

echo.
echo Method 1: Removing files that were in that commit from ALL history...
echo.

REM Remove all files that contained secrets from entire git history
echo Removing INTEGRATION_COMPLETE_CHECKLIST.md from all history...
git filter-repo --path INTEGRATION_COMPLETE_CHECKLIST.md --invert-paths --force

echo Removing TWILIO_SETUP_GUIDE.md from all history...
git filter-repo --path TWILIO_SETUP_GUIDE.md --invert-paths --force

echo Removing all .pyc files from history...
git filter-repo --path-glob "*.pyc" --invert-paths --force
git filter-repo --path-glob "__pycache__/**" --invert-paths --force

echo.
echo Method 2: Removing old versions of settings.py that contained secrets...
echo This will remove ALL versions of settings.py from history, then re-add the clean version.
echo.
set /p remove_settings="Remove settings.py from history? (yes/no): "

if "%remove_settings%"=="yes" (
    echo Removing ALL versions of settings.py from history...
    git filter-repo --path backend/backend/settings.py --invert-paths --force
    echo.
    echo ✅ settings.py removed from history.
    echo Now re-adding the cleaned version...
    git add backend/backend/settings.py
    git commit -m "Add cleaned settings.py without secrets"
    echo.
)

echo.
echo Method 3: Alternative - Remove the specific commit using rebase...
echo You can also use: git rebase -i 498bafe^
echo Then change 'pick' to 'drop' for commit 498bafe
echo.

echo.
echo ✅ Git history cleaned!
echo.
echo 📋 Next steps:
echo 1. Verify the commit is gone: git log --oneline | findstr 498bafe
echo    (Should return nothing if successfully removed)
echo 2. Verify secrets are gone: git log -S "ACa1388f21d29a10993c979d411dd03da2" --all
echo    (Should return nothing)
echo 3. If commit still exists, try: git rebase -i 498bafe^
echo 4. Force push: git push origin main --force
echo    WARNING: This rewrites history on remote!
echo.
echo ⚠️  IMPORTANT: 
echo    - Rotate your Twilio credentials in Twilio dashboard
echo    - Rotate your YOTI credentials in YOTI dashboard
echo    - The old credentials are compromised!
echo.
pause

