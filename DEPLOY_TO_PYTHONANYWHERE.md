# Deploy Favorite Images Feature to PythonAnywhere

## Step 1: Commit Your Changes Locally

```bash
cd "p:\aoon bhai\se\adminpanel_integration_se\backend"
git add .
git commit -m "Add favorite images feature with model, views, serializers, and endpoints"
git push origin main
```

## Step 2: Login to PythonAnywhere

1. Go to https://www.pythonanywhere.com/
2. Login to your account
3. Go to **Consoles** tab

## Step 3: Open a Bash Console

1. Click "Bash" to open a new bash console
2. Navigate to your project directory:

```bash
cd ~/exposureselect  # or your project directory name
```

## Step 4: Pull Latest Changes

```bash
git pull origin main
```

## Step 5: Activate Virtual Environment

```bash
source venv/bin/activate  # or source env/bin/activate
```

## Step 6: Run Migrations

```bash
cd backend  # if backend is in a subdirectory
python manage.py makemigrations
python manage.py migrate
```

You should see:
```
Migrations for 'accounts':
  accounts/migrations/0016_favoriteimage.py
    - Create model FavoriteImage
    
Operations to perform:
  Apply all migrations: accounts, admin, auth, contenttypes, sessions
Running migrations:
  Applying accounts.0016_favoriteimage... OK
```

## Step 7: Restart Web App

1. Go to the **Web** tab in PythonAnywhere
2. Click the **"Reload exposureselect.pythonanywhere.com"** button (big green button)
3. Wait for it to finish reloading

## Step 8: Verify Deployment

Test the endpoints in your browser or using curl:

### Test 1: List Favorites (should return empty array or your favorites)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://exposureselect.pythonanywhere.com/api/accounts/favorites/
```

### Test 2: Check if endpoint exists (should return 401 Unauthorized if not authenticated, not 404)
```bash
curl https://exposureselect.pythonanywhere.com/api/accounts/favorites/
```

If you get 404, the changes weren't deployed correctly.
If you get 401, the endpoint exists but needs authentication ✅

## Troubleshooting

### Issue: git pull fails with merge conflicts
```bash
git stash
git pull origin main
git stash pop
```

### Issue: Migrations fail
```bash
# Check if you're in the right directory
pwd
# Should show something like: /home/yourusername/exposureselect/backend

# Check if manage.py exists
ls -la manage.py

# Try running migrations with verbose output
python manage.py migrate --verbosity 2
```

### Issue: Web app doesn't reload
1. Go to Web tab
2. Check **Error log** for any errors
3. Check **Server log** for startup issues
4. Make sure your WSGI configuration is correct

### Issue: Still getting 404 after reload
1. Check that urls.py changes were pulled correctly:
```bash
cat accounts/urls.py | grep favorites
```
You should see: `router.register("favorites", FavoriteImageViewSet, basename="favorites")`

2. Check that the views were imported:
```bash
cat accounts/urls.py | grep FavoriteImageViewSet
```

3. Restart the web app again from the Web tab

## Quick Deploy Script (All-in-One)

You can create a deploy script on PythonAnywhere:

```bash
#!/bin/bash
cd ~/exposureselect
git pull origin main
source venv/bin/activate
cd backend
python manage.py migrate
touch /var/www/exposureselect_pythonanywhere_com_wsgi.py
echo "Deployment complete! Go reload your web app from the Web tab."
```

Save as `deploy.sh` and run with: `bash deploy.sh`

## Alternative: Use Local Development Server

If deployment is taking too long, you can test locally:

1. Update `SE/src/utils/Instance.jsx`:
```javascript
const API_BASE = "http://127.0.0.1:8000/api/";
const BACKEND_BASE = "http://127.0.0.1:8000/";
```

2. Run Django server locally:
```bash
cd "p:\aoon bhai\se\adminpanel_integration_se\backend"
..\venv\Scripts\python.exe manage.py runserver
```

3. Test the app locally
4. When done testing, change back to production URL

