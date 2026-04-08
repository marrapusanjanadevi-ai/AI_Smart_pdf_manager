import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from db.database import engine, Base
from routes import upload, search, documents, merge, delete, chat, category

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Smart PDF Manager")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, tags=["Upload"])
app.include_router(search.router, tags=["Search"])
app.include_router(documents.router, tags=["Documents"])
app.include_router(merge.router, tags=["Merge"])
app.include_router(delete.router, tags=["Delete"])
app.include_router(chat.router, tags=["Chat"])
app.include_router(category.router, tags=["Category"])

# Mount static files for viewing PDFs
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {"message": "AI Smart PDF Manager API is running"}
