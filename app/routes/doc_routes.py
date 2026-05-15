from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from pydantic import BaseModel
import shutil
import os
import uuid
from typing import List, Optional
from datetime import datetime

from app.services.document_processor import extract_text
from app.services.groq_service import analyze_text
from app.utils.text_utils import chunk_text
from app.services.supabase_service import supabase

router = APIRouter()

UPLOAD_DIR = "/tmp/uploads" if os.environ.get("VERCEL") else "uploads"
HISTORY_FILE = "/tmp/history.json" if os.environ.get("VERCEL") else "history.json"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class AnalysisResponse(BaseModel):
    summary: str
    insights: List[str]
    actions: List[str]
    extracted_text: Optional[str] = None

class HistoryItem(BaseModel):
    id: str
    filename: str
    timestamp: str
    results: AnalysisResponse

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.pdf', '.docx', '.txt')):
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, and TXT files are supported")
    
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{ext}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"message": "File uploaded successfully", "file_id": file_id, "filename": file.filename}

@router.post("/analyze/{file_id}", response_model=AnalysisResponse)
async def analyze_document(file_id: str, filename: Optional[str] = Form(None)):
    matched_files = [f for f in os.listdir(UPLOAD_DIR) if f.startswith(file_id)]
    if not matched_files:
        raise HTTPException(status_code=404, detail="File not found")
        
    file_path = os.path.join(UPLOAD_DIR, matched_files[0])
    display_filename = filename or matched_files[0]
    
    try:
        text = extract_text(file_path)
        if not text or len(text.strip()) == 0:
            # Scanned or image-based PDF with no extractable text — return graceful message
            return {
                "summary": "This document appears to be a scanned image or does not contain extractable text. AutoDoc AI cannot analyze image-based PDFs without OCR support.",
                "insights": ["Document text could not be extracted. It may be a scanned or image-only PDF."],
                "actions": ["Try converting the PDF to a text-based version using an OCR tool such as Adobe Acrobat or Tesseract OCR, then re-upload."],
                "extracted_text": ""
            }
            
        text_chunks = chunk_text(text, max_chars=15000)
        
        analysis = analyze_text(text_chunks)
        analysis["extracted_text"] = text
        
        doc_data = {
            "id": file_id,
            "filename": display_filename,
            "timestamp": datetime.now().isoformat(),
            "results": analysis
        }
        
        if supabase:
            try:
                supabase.table("documents").insert(doc_data).execute()
            except Exception as db_e:
                print(f"Error saving to Supabase: {db_e}")
                
        # Fallback: Save to local JSON file
        try:
            import json
            history_file = HISTORY_FILE
            local_history = []
            if os.path.exists(history_file):
                with open(history_file, "r") as f:
                    try:
                        local_history = json.load(f)
                    except json.JSONDecodeError:
                        pass
            local_history.append(doc_data)
            with open(history_file, "w") as f:
                json.dump(local_history, f)
        except Exception as local_e:
            print(f"Error saving locally: {local_e}")
        
        return analysis
        
    except HTTPException as he:
        raise he
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[HistoryItem])
async def get_history():
    history_data = []
    if supabase:
        try:
            response = supabase.table("documents").select("*").order("timestamp", desc=True).execute()
            history_data = response.data
        except Exception as e:
            print(f"Error fetching from Supabase: {e}")
            
    if not history_data:
        try:
            import json
            history_file = HISTORY_FILE
            if os.path.exists(history_file):
                with open(history_file, "r") as f:
                    history_data = json.load(f)
                # Sort by timestamp descending
                history_data.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        except Exception as e:
            print(f"Error fetching local history: {e}")
            
    return history_data
