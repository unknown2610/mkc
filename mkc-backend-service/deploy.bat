@echo off
echo ========================================================
echo  Deploying MKC Backend Service to Google Cloud Run
echo  Project ID: mkc-office-auto
echo ========================================================

REM Check if logged in
call gcloud auth print-access-token >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: You are not logged in to gcloud.
    echo Please run 'gcloud auth login' and try again.
    exit /b 1
)

echo [1/3] Enabling required APIs (this may take a minute)...
call gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

echo [2/3] Building Container Image...
call gcloud builds submit --tag gcr.io/mkc-office-auto/mkc-backend-service .

echo [3/3] Deploying to Cloud Run...
call gcloud run deploy mkc-backend-service --image gcr.io/mkc-office-auto/mkc-backend-service --platform managed --region us-central1 --allow-unauthenticated --service-account drive-607@mkc-office-auto.iam.gserviceaccount.com

echo ========================================================
echo  Deployment script finished.
echo ========================================================
