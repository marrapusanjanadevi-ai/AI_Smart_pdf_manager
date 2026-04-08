from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from google import genai
import os
from dotenv import load_dotenv

from db.database import get_db
from services.semantic_search import search

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

router = APIRouter()

class ChatRequest(BaseModel):
    query: str

@router.post("/chat")
def chat_with_documents(payload: ChatRequest, db: Session = Depends(get_db)):
    if not api_key or api_key == "your_gemini_api_key_here":
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured. Please set GOOGLE_API_KEY in the .env file.")

    # 1. FAISS Semantic Search
    results = search(payload.query, db, top_k=5)
    
    # 2. Extract context
    if not results:
        context_string = "No relevant context found in the uploaded PDFs."
    else:
        contexts = [f"Source: {res['document_name']}\nText: {res['chunk_text']}" for res in results]
        context_string = "\n\n".join(contexts)

    # 3. Construct System Prompt + RAG
    prompt = f"""
You are a highly intelligent PDF assistant.
Use ONLY the provided context from the user's documents to answer the question.
If the context does not contain the information needed to answer the query, state honestly that you do not know based on the provided documents.
Do not hallucinate external knowledge.

--- CONTEXT ---
{context_string}
--- END CONTEXT ---

USER QUERY: {payload.query}
"""

    # 4. Generate Response using Gemini (new google-genai SDK)
    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return {
            "answer": response.text,
            "evidence": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")
