import { openai } from "./openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const getSummaryForSource = async (
  source: string,
  fileName: string,
  fileType: string
) => {
  const responseFormat = z.object({
    title: z.string(),
    description: z.string(),
    keyTopics: z.array(z.string()),
  });

  const response = await openai.beta.chat.completions.parse({
    model: "meta-llama/llama-3-70b-instruct",
    messages: [
      {
        role: "system",
        content: `You are a helpfull assitant that summarizes text. You will be given a text and you will need to summarize it overall briefly
          
          ***You need to provide the summary description, the summary title and the list of key topics ***
          `,
      },
      {
        role: "user",
        content: `fileName: ${fileName}, fileType: ${fileType}, source: ${source}`,
      },
    ],
    response_format: zodResponseFormat(responseFormat, "summary"),
  });

  return response.choices[0].message.parsed;
};
