import { z, TypeOf } from "zod";

export const validationCreateOrUpdateCharacterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "name is required" })
    .max(50, { message: "name is too long}" }),
  image: z.string().url().optional(),
  lang: z.enum(["en", "fr", "es", "pt", "cn", "jp", "ru"]),
  temperature: z.string().optional(),
  mood: z.string(),
  description: z.string().min(10).max(1500),
  tips: z.string().max(500).optional(),
  prompt: z.string().min(10).max(500).optional(),
  file: z.record(z.string(), z.any()).optional(),
});

export const createCharacterZodSchema = z
  .object({
    name: z.string().describe("the name of the character"),
    lang: z
      .enum(["en", "fr", "es", "pt", "cn", "jp", "ru"])
      .describe("the language used by the character"),
    temperature: z
      .string()
      .describe(
        "the open Ai temperature / creativity on answer of the character. 0 is the less creative and 100 the most creative"
      ),
    mood: z
      .string()
      .describe(
        "the actual mood of the character. 0 is the saddest, 100 is the happiest"
      ),
    description: z.string().describe("the description of the character."),
    tips: z
      .string()
      .describe("some tips on how to chat with him on my fanchat app"),
    prompt: z
      .string()
      .describe(
        "the description of the character to interact within a prompt. The name of the character has to be present "
      ),
  })
  .describe("a fictional character from a movie or a video game");

export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  temperature: z.number().optional(),
  mood: z.string(),
  image: z.string(),
  tips: z.string().optional(),
  prompt: z.string(),
  lang: z.enum(["en", "fr", "es", "pt", "cn", "jp", "ru"]),
});

export type CharacterSchemaType = TypeOf<typeof CharacterSchema>;
