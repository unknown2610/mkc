from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import os
import shutil
# from google.oauth2 import service_account
# from googleapiclient.discovery import build

from google.oauth2 import service_account
import google.auth
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

app = FastAPI(title="MKC Automation API", description="Backend service for Heavy Processing & Drive Storage")

# Target Google Drive Folder ID
DRIVE_FOLDER_ID = '10pLSbrfuWHpuiTUv8E6AlLOJPqkg6bis'

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "MKC Backend", "storage_target": "Google Drive", "folder_id": DRIVE_FOLDER_ID}

@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    """
    Receives a file and uploads it to the configured Google Drive folder.
    Uses Application Default Credentials (ADC) of the Cloud Run Service Account.
    """
    try:
        # 1. Save locally temporarily
        temp_filename = f"/tmp/{file.filename}"
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. Upload to Google Drive
        # Use ADC - works automatically on Cloud Run if the service account has rights
        creds, _ = google.auth.default()
        service = build('drive', 'v3', credentials=creds)
        
        file_metadata = {'name': file.filename, 'parents': [DRIVE_FOLDER_ID]}
        media = MediaFileUpload(temp_filename, resumable=True)
        
        drive_file = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink').execute()
        
        # 3. Clean up
        os.remove(temp_filename)

        return JSONResponse(content={
            "status": "success",
            "message": f"File '{file.filename}' uploaded to Drive.",
            "drive_file_id": drive_file.get('id'),
            "view_link": drive_file.get('webViewLink')
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
