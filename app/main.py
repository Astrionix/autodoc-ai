import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import doc_routes

app = FastAPI(
    title="AutoDoc AI - Academic Intelligence Platform",
    description="API for extracting text and generating insights using Groq API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)

app.include_router(doc_routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to AutoDoc AI API"}
