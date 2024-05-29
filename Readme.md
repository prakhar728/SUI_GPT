# WashingtonOrWashingTon

In the rapidly evolving landscape of AI-powered assistants and chatbots, having a solution tailored to assist in learning new programming languages has become increasingly invaluable. Although numerous AI chatbots are trained using documentation for commonly used languages, they often fall short in delivering accurate information specifically tailored to Move.

Leveraging open-source Large Language Models (LLMs), we've developed and implemented a chatbot specifically designed to facilitate the learning process for the Move programming language. By integrating insights from both the Move Notebook and its corresponding GitHub repository, our chatbot serves as a comprehensive resource, streamlining the learning experience and eliminating the need for manual information retrieval and sifting through extensive documentation. This innovative approach offers a swift and efficient alternative, empowering users to swiftly address queries and overcome obstacles in their coding journey.

## What it does

The Move notebook and GitHub repository serve as the contextual sources from which the model retrieves responses to user inquiries concerning the Move language. Utilizing a Large Language Model (LLM) in the backend, the chatbot employs a Retrieve and Generate (RAG) mechanism to address user queries effectively.

## How we built it

To construct our solution, we initiated by loading the move-book document from the website and github-repository containing relevant information about Move using langchain built-in loaders. Subsequently, we employed a process known as chunking to segment the document into manageable sections. These sections were then encoded and conerted into vectors using hugging-face embeddings, allowing for efficient storage within a vector database.

Once the vector representation of the document was established, we utilized it as context within our system. This context served as the foundation for retrieving accurate responses to user inquiries. To achieve this, we utiised a Large Language Model (LLM), which was tasked with fetching answers based on the provided context.

In the operational backend of our system, the LLM is dynamically invoked upon receiving each user query. Leveraging the contextual information stored in the vector database, the LLM swiftly generates responses tailored to the specific needs and inquiries of the user, ensuring a seamless and informative interaction experience.

## Technologies Used

langhchain 
huggingface
fastapi
Anthropic AI

## General Application Architecture


## Challenges we ran into
Inaccurate Replies: One of the primary hurdles we faced was the occurrence of models providing inaccurate responses. Despite rigorous training and optimization efforts, ensuring precise replies remained a persistent challenge.

Resource Limitations: Loading and running complex models demanded substantial computational resources. Unfortunately, we encountered difficulties in this area, as our infrastructure lacked the necessary resources to handle the computational demands efficiently.

Latency Issues: Certain models exhibited prolonged response times when tasked with addressing even basic queries. This latency posed a significant challenge, hindering the responsiveness and user experience of our system.

Deployment Constraints: We explored local deployment options to mitigate resource limitations. However, transitioning to online deployment via platforms like Colab presented its own set of challenges, primarily due to the resource-intensive nature of our solution.

## What's next for SUI_GPT
chat-history

## Caveats
chat-history?
