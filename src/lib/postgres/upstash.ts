import { Index } from "@upstash/vector";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { v4 as uuid } from "uuid";

const vectorStore = new Index({
  url: process.env.UPSTASH_VECTOR_ENDPOINT,
  token: process.env.UPSTASH_VECTOR_TOKEN,
});

async function addToVectorStore(
  notebookId: string,
  sourceId: string,
  content: string
) {
  const textSplitter = new CharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const _splitData = await textSplitter.splitText(content);

  for (const chunk of _splitData) {
    await vectorStore.upsert({
      id: uuid(),
      data: chunk,
      metadata: {
        notebookId,
        sourceId,
      },
    });
  }
}

export { vectorStore, addToVectorStore };
