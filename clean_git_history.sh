#!/bin/bash
# Git History Cleanup Script
# This script removes secrets from git history
# WARNING: This rewrites git history. Make sure you have a backup!

echo "⚠️  WARNING: This will rewrite git history!"
echo "Make sure you have a backup of your repository."
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

# Install git-filter-repo if not available
if ! command -v git-filter-repo &> /dev/null; then
    echo "Installing git-filter-repo..."
    pip install git-filter-repo
fi

echo ""
echo "🧹 Cleaning git history..."

# Remove files with secrets from git history
echo "Removing INTEGRATION_COMPLETE_CHECKLIST.md from history..."
git filter-repo --path INTEGRATION_COMPLETE_CHECKLIST.md --invert-paths --force

echo "Removing TWILIO_SETUP_GUIDE.md from history..."
git filter-repo --path TWILIO_SETUP_GUIDE.md --invert-paths --force

echo "Removing .pyc files from history..."
git filter-repo --path-glob '*.pyc' --invert-paths --force
git filter-repo --path-glob '__pycache__/**' --invert-paths --force

echo "Removing old settings.py versions with secrets..."
# This will remove the file from history, but we need to be careful
# We'll use BFG Repo-Cleaner or manual approach for settings.py
echo "⚠️  Note: You may need to manually clean settings.py from history"
echo "    using: git filter-repo --path backend/backend/settings.py --invert-paths --force"
echo "    Then re-add the cleaned version."

echo ""
echo "✅ Git history cleaned!"
echo ""
echo "📋 Next steps:"
echo "1. Review the changes: git log"
echo "2. Add your cleaned settings.py back: git add backend/backend/settings.py"
echo "3. Commit: git commit -m 'Remove secrets from codebase'"
echo "4. Force push: git push origin main --force"
echo ""
echo "⚠️  IMPORTANT: Rotate your Twilio and YOTI credentials in their dashboards!"

