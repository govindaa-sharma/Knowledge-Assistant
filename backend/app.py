from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from graph import workflow
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage

app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # For development. Later restrict to Vercel domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    message: str
    messages: list | None = None  # full conversation history

@app.post("/chat")
def chat(query: Query):

    history = []
    if query.messages:
        for m in query.messages:
            if m["role"] == "user":
                history.append(HumanMessage(content=m["content"]))
            else:
                history.append(AIMessage(content=m["content"]))

    history.append(HumanMessage(content=query.message))

    result = workflow.invoke({"messages": history})
    answer = result["messages"][-1].content

    return {"response": answer}
