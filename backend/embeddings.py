import google.generativeai as genai
from langchain.embeddings.base import Embeddings
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class GeminiEmbeddings(Embeddings):
    def __init__(self, model_name="text-embedding-004"):
        self.model_name = model_name

    def embed_documents(self, texts):
        response = genai.embed_content(
            model=self.model_name,
            content=texts,
            task_type="retrieval_document"
        )
        return response['embedding']

    def embed_query(self, text):
        response = genai.embed_content(
            model=self.model_name,
            content=text,
            task_type="retrieval_query"
        )
        return response['embedding']
