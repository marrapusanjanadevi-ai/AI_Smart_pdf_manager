from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from db.database import get_db
from db.models import Document

router = APIRouter()

from typing import Optional

class MergeRequest(BaseModel):
    doc1_id: int
    doc2_id: int
    merged_file_name: Optional[str] = None

@router.post("/merge")
def merge_documents(payload: MergeRequest, db: Session = Depends(get_db)):
    """
    Merging PDFs entails combining them into one file.
    For this AI system, we will just simulate the merge by logging it,
    or using PyMuPDF to actually merge them.
    """
    doc1 = db.query(Document).filter(Document.id == payload.doc1_id).first()
    doc2 = db.query(Document).filter(Document.id == payload.doc2_id).first()
    
    if not doc1 or not doc2:
        raise HTTPException(status_code=404, detail="Documents not found")
        
    import fitz
    import os
    
    # Ensure standard extension mapping
    merged_filename = payload.merged_file_name
    if not merged_filename:
        merged_filename = f"merged_{doc1.file_name}_{doc2.file_name}"
        
    if not merged_filename.endswith(".pdf"):
        merged_filename += ".pdf"
        
    merged_filepath = f"uploads/{merged_filename}"
    
    # Actual merge using PyMuPDF
    try:
        pdf_res = fitz.open()
        pdf_res.insert_pdf(fitz.open(doc1.file_path))
        pdf_res.insert_pdf(fitz.open(doc2.file_path))
        pdf_res.save(merged_filepath)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to merge PDFs: {str(e)}")

    # Create new document record
    new_doc = Document(
        file_name=merged_filename,
        file_path=merged_filepath,
        tags="Merged",
        summary=f"Merged from {doc1.file_name} and {doc2.file_name}"
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    return {"message": "Documents merged successfully", "merged_document": new_doc}
