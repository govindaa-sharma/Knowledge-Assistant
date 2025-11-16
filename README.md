📘 Knowledge Assistant – RAG Powered Internal Query System

This is a simple RAG (Retrieval-Augmented Generation) assistant where users can:

Upload documents

Index them into a vector database

Ask any question

Receive context-aware answers using Gemini 2.5 Flash and local embeddings (all-MiniLM-L6-v2).

The system uses:

FastAPI backend

React + Vite frontend

FAISS for vector search

LangChain for text splitting + embedding pipeline

Gemini for generating final responses

🧠 How It Works
1. Document Upload

Users upload .txt, .pdf, .md, or similar files.
They are saved to:

backend/data/raw_docs/

2. Vector Indexing

When the backend starts or when indexing is triggered, the system:

Loads raw documents

Splits them into chunks

Converts chunks into vector embeddings (all-MiniLM-L6-v2)

Stores them into a FAISS index at:

backend/data/vector_store/

3. Asking Questions

User enters a question in the frontend:

Question is sent to /chat

Backend embeds the question

Semantic search retrieves the most relevant chunks

Gemini uses those chunks as context

A final answer is generated and returned to the user

🧩 Project Structure
knowledge_assistant/
│
├── backend/
│   ├── app.py                # FastAPI main server
│   ├── embeddings.py         # Embedding model and helper functions
│   ├── retriever.py          # FAISS retriever + vector store logic
│   ├── graph.py              # (Optional) LLM execution graph
│   ├── requirements.txt      # Backend dependencies
│   ├── .env                  # LLM API keys + model config
│   │
│   └── data/
│       ├── raw_docs/         # Uploaded documents
│       └── vector_store/     # FAISS vector index of embeddings
│
└── frontend/
    ├── src/
    │   ├── App.jsx           # Main React component (UI)
    │   ├── App.css           # Styling
    │   ├── index.css
    │   ├── main.jsx
    │   └── assets/
    ├── public/
    ├── package.json
    └── vite.config.js

⚙️ Backend Setup
1. Go to backend folder
cd backend

2. Create .env file
GOOGLE_API_KEY=your_key_here
MODEL_NAME=gemini-2.5-flash
EMB_MODEL=all-MiniLM-L6-v2

3. Install dependencies
pip install -r requirements.txt

4. Start backend
uvicorn app:app --reload --port 8000


Backend will run at:

http://localhost:8000

💻 Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

🔑 API Endpoints
1. Upload Document
POST /upload


Uploads a file and stores it in raw_docs/.

2. Rebuild Vector Index
POST /reindex


Processes all documents and updates FAISS embeddings.

3. Ask Question (RAG Chat)
POST /chat


Request body:

{
  "message": "Your question here"
}


Response:

{
  "answer": "AI-generated answer with context"
}
