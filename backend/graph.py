from typing import TypedDict, Sequence
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
from retriever import get_retriever
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import google.generativeai as genai
import os

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class AgentState(TypedDict):
    messages: Sequence[BaseMessage]
    context: str | None

retriever = get_retriever()

def router_node(state: AgentState):
    query = state["messages"][-1].content.lower()

    if any(word in query for word in ["leave", "work hours", "remote", "holiday"]):
        route = "hr"
    elif any(word in query for word in ["docker", "repo", "api", "deploy", "microservice"]):
        route = "technical"
    else:
        route = "general"
    
    return {"messages": state["messages"], "context": route}


def retriever_node(state: AgentState):
    query = state["messages"][-1].content
    docs = retriever.invoke(query)
    combined = "\n\n".join([d.page_content for d in docs])
    return {"messages": state["messages"], "context": combined}


def synthesizer_node(state: AgentState):
    context = state["context"]
    prompt = f"Summarize the following context clearly and concisely:\n\n{context}"
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt) 
    return {"messages": state["messages"], "context": response.text}


def response_node(state: AgentState):
    messages = state["messages"]
    context = state["context"]

    # Convert history into formatted text
    conversation_history = "\n".join([
        f"User: {m.content}" if m.type == "human" else f"Assistant: {m.content}"
        for m in messages
    ])

    user_query = messages[-1].content

    prompt = f"""
You are a helpful company knowledge assistant.

You answer based on internal documents and past conversation context.
If unsure, say you don't have enough information.

Conversation so far:
{conversation_history}

Relevant Context:
{context}

User Question:
{user_query}

Provide the best continuation response.
"""

    answer = genai.GenerativeModel("gemini-2.5-flash").generate_content(prompt).text
    return {"messages": messages + [AIMessage(content=answer)], "context": None}


graph = StateGraph(AgentState)
graph.add_node("router", router_node)
graph.add_node("retrieve", retriever_node)
graph.add_node("synthesize", synthesizer_node)
graph.add_node("respond", response_node)

graph.set_entry_point("router")
graph.add_edge("router", "retrieve")
graph.add_edge("retrieve", "synthesize")
graph.add_edge("synthesize", "respond")
graph.add_edge("respond", END)

workflow = graph.compile()