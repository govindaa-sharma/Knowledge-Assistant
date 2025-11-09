import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_core.documents import Document
from embeddings import GeminiEmbeddings

DATA_PATH = "data/raw_docs/"
VECTOR_PATH = "data/vector_store/"

def load_documents():
    docs = []
    for filename in os.listdir(DATA_PATH):
        with open(os.path.join(DATA_PATH, filename), "r", encoding="utf-8") as f:
            text = f.read()
            docs.append(Document(page_content=text, metadata={"source": filename}))
    return docs

def create_vector_store():
    documents = load_documents()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    split_docs = splitter.split_documents(documents)

    embeddings = GeminiEmbeddings()
    
    vectordb = Chroma.from_documents(
        documents=split_docs,
        embedding=embeddings,
        persist_directory=VECTOR_PATH
    )
    vectordb.persist()
    print("✅ Vector Store Created Successfully!")

def get_retriever():
    embeddings = GeminiEmbeddings()
    vectordb = Chroma(
        persist_directory=VECTOR_PATH,
        embedding_function=embeddings
    )
    retriever = vectordb.as_retriever(search_kwargs={"k": 4})
    return retriever
