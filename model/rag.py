import os
import torch
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_anthropic import ChatAnthropic
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain import hub
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
import logging

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from pyngrok import ngrok
import nest_asyncio

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# def run_rag_model(prompt_text):
#     # Load environment variables

load_dotenv()

huggingface_api_key = os.getenv('HF_TOKEN')
pinecone_api_key = os.getenv('PINECONE_API_KEY')

# Verify keys are loaded (uncomment for debugging)
# print(huggingface_api_key)
# print(pinecone_api_key)

# Check if CUDA is available and set device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Initialize the language model
llm = ChatAnthropic(model="claude-3-sonnet-20240229")

# Initialize Pinecone
pc = Pinecone(api_key=pinecone_api_key)
index_name = "move-rag"
index = pc.Index(index_name)

# Initialize the vector store
vectordb = PineconeVectorStore(index_name=index_name, embedding=HuggingFaceEmbeddings())
retriever = vectordb.as_retriever()

# Load the prompt
prompt = hub.pull("rlm/rag-prompt")

# Function to format documents
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# Define the RAG chain
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)


class QueryRequest(BaseModel):
    query: str

# Define the prediction endpoint
@app.post("/predict/")
async def predict(request: QueryRequest):
    print(request)
    query = request.query
    print(query)
    try:
        # Use the RAG chain to process the query
        response = rag_chain.invoke(query)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

ngrok.set_auth_token(os.getenv("NGROK_API_KEY"))

# Expose the FastAPI app through ngrok
public_url = ngrok.connect(8000)
print(f"Public URL: {public_url}")
# Use nest_asyncio to allow nested event loops
nest_asyncio.apply()
# Run the FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)