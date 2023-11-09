"use server";

import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import {  createCharacterZodSchema } from "@/lib/validation";
import { OpenAI } from "langchain/llms/openai";


/**
 * Generates a whole character based on a given description and language.
 * @param {Object} options - The options object.
 * @param {string} options.description - The description of the character.
 * @param {string} options.lang - The language to use for generating the character.
 * @returns {Promise<string[]>} - A promise that resolves to an array of strings representing the generated character.
 */
export const generateWholeCharacter = async ({
  description,
  lang,
}: {
  description: string;
  lang: string;
}) => {
  const outputParser = StructuredOutputParser.fromZodSchema(
    createCharacterZodSchema
  );

  const chatModel = new ChatOpenAI({
    modelName: "gpt-3.5-turbo", // Or gpt-3.5-turbo
    temperature: 1, // For best results with the output fixing parser,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const outputFixingParser = OutputFixingParser.fromLLM(
    chatModel,
    outputParser
  );

  const preTemplate = !description
    ? `Hi GPT ! First use the description of a fictive character to generate the name of the character`
    : `First use the description  of the character here : ${description} to generate the name of the character`;

  // Don't forget to include formatting instructions in the prompt!
  const prompt = new PromptTemplate({
    template: `${preTemplate} \n{query} \n{format_instructions}`,
    inputVariables: ["query"],
    partialVariables: {
      format_instructions: outputFixingParser.getFormatInstructions(),
    },
  });

  const answerFormattingChain = new LLMChain({
    llm: chatModel,
    prompt,
    outputKey: "records", // For readability - otherwise the chain output will default to a property named "text"
    outputParser: outputFixingParser,
  });

  const result = await answerFormattingChain.call({
    query: `Then Choose a language, a mood, an exciting name, a temperature (level of creativity of the character from 0 to 10), a mood (0 to 10), a catchy description, some tips and 4 to 6 faqs.
           Choose ${lang} as language and write on this language. Respect the format instructions.
           Be creative !
           `,
  });

  return result.records;
};

/**
 * Generates a character image based on the given prompt using the OpenAI API.
 * @param prompt The prompt to generate the character image from.
 * @returns A Promise that resolves to the URL of the generated image.
 */
export const generateCharacterImage = async (prompt: string) => {
  const model = new OpenAI({
    temperature: 0.9,
    maxTokens: 40,
  });
  const message = await model
    .call(
      `I need you to create the best decriptive prompt with maximum 30 words and in English to generate a portrait from the description. 
        Description : ${prompt}
        Your answer in english : 
        `
    )
    

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "dall-e-2",
      size: "256x256",
      prompt: `A portrait following this description :${message}`,
      n: 1,
    }),
  }).then((res) => res.json());

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data[0].url as string;
};

export const generateAll = async ({
  description,
  lang,
}: {
  description: string;
  lang: string;
}) => {
  const character = await generateWholeCharacter({ description, lang });
  const imageCharacter = await generateCharacterImage(character.description);
  return { ...character, image: imageCharacter };
};

