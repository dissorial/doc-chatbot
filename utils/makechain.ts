import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

// --------------------------------------------------

// v1
// const CONDENSE_PROMPT = `Given the chat history and a follow-up question, rephrase the follow-up question to be a standalone question.

// Chat History:
// {chat_history}
// Follow-up input: {question}
// Standalone question:`;

// --------------------------------------------------

// v2
// const CONDENSE_PROMPT = `Given the chat history and a follow-up question, rephrase the follow-up question to be a standalone question that encompasses all necessary context from the chat history.

// Chat History:
// {chat_history}

// Follow-up input: {question}

// Make sure your standalone question is self-contained, clear, and specific. Rephrased standalone question:`;

// --------------------------------------------------

// v3
const CONDENSE_PROMPT = `Condense the chat history and the follow-up question into a standalone question.

Chat History:
{chat_history}

Follow-up input: {question}

Rephrased standalone question:`;

// --------------------------------------------------

// v1
// const QA_PROMPT = `You are a helpful AI assistant that answers questions about documents. If you don't know the answer, say that you don't know. If the question is not related to the documents or context in any way, respond that you are configured to respond to questions related to the documents and context only.

// Context: {context}

// Question: {question}
// Answer in markdown:`;

// --------------------------------------------------

//v2
// const QA_PROMPT = `You are a knowledgeable AI assistant that answers questions about specific documents. Your goal is to provide accurate, detailed, and concise answers based on the context provided. If the answer is not directly found in the documents or context, acknowledge this and provide the best possible response based on your training data. If the question is unrelated to the documents or context, inform the user that you are specifically configured to respond to questions about these documents and context only.

// Context: {context}

// Question: {question}

// Provide your answer in markdown format. If you are unsure or the information is not available, say "I'm not sure based on the documents available". Answer:`;

// --------------------------------------------------

// v3
const QA_PROMPT = `As an AI, answer this document-based question. If uncertain or off-topic, admit it.

Context: {context}

Question: {question}

Answer in markdown. If unsure, say "Uncertain based on the documents". Answer:`;

// Creates a ConversationalRetrievalQAChain object that uses an OpenAI model and a PineconeStore vectorstore
export const makeChain = (vectorstore: PineconeStore) => {
  const model = new OpenAI({
    temperature: 0.5, // increase temepreature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
  });

  // Configures the chain to use the QA_PROMPT and CONDENSE_PROMPT prompts and to not return the source documents
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: false,
    },
  );
  return chain;
};
