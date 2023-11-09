import { describe, expect, test, jest, afterEach } from "@jest/globals";

import {
  generateWholeCharacter,
  generateCharacterImage,
  generateAll,
} from "./generate";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";

import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

jest.mock("langchain/output_parsers", () => ({
  StructuredOutputParser: { fromZodSchema: jest.fn() },
  OutputFixingParser: {
    fromLLM: jest.fn(() => ({
      getFormatInstructions: jest.fn(),
    })),
  },
}));
jest.mock("langchain/chat_models/openai", () => ({
  ChatOpenAI: jest.fn(),
}));
jest.mock("langchain/prompts", () => ({
  __esModule: true,
  PromptTemplate: jest.fn(),
}));
jest.mock("langchain/llms/openai", () => ({
  OpenAI: jest.fn(),
}));

jest.mock("node-fetch");

jest.mock("langchain/chains", () => ({
  LLMChain: jest.fn(),
}));
const mockUrl = "https://example.com/image.png";
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: [{ url: mockUrl }] }),
  })
);

describe("generateWholeCharacter function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("generates a whole character", async () => {
    const mockDescription = "Description";
    const mockLang = "en";
    const mockRecords = ["Record"];
    LLMChain.mockReturnValue({ call: () => ({ records: mockRecords }) });

    const result = await generateWholeCharacter({
      description: mockDescription,
      lang: mockLang,
    });

    expect(StructuredOutputParser.fromZodSchema).toHaveBeenCalled();
    expect(ChatOpenAI).toHaveBeenCalled();
    expect(OutputFixingParser.fromLLM).toHaveBeenCalled();
    expect(PromptTemplate).toHaveBeenCalled();
    //expect(LLMChain).toHaveBeenCalled();
    expect(result).toEqual(mockRecords);
  });
});

describe("generateCharacterImage function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("generates a character image", async () => {
    const mockPrompt = "Prompt";
    const mockMessage = "Message";
    const mockUrl = "https://example.com/image.png";

    OpenAI.mockReturnValue({ call: () => mockMessage });

    const result = await generateCharacterImage(mockPrompt);

    expect(OpenAI).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalled();
    expect(result).toEqual(mockUrl);
  });
});


