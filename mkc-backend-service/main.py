from fastapi import FastAPI, UploadFile, File
import uvicorn
import os

app = FastAPI(title="MKC Automation API", description="Backend service for Heavy Processing (Bank2Excel, OCR)")

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "MKC Backend"}

@app.post("/parse-bank-statement")
async def parse_bank_statement(file: UploadFile = File(...)):
    """
    Endpoint (Placeholder) for parsing .rpt or PDF bank statements.
    This is where the 'Bank2Excel' logic will eventually live.
    """
    return {
        "filename": file.filename,
        "message": "File received. Parsing logic to be implemented.",
        "status": "success"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
