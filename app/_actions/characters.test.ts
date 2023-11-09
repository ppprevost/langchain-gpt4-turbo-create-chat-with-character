import { test, expect, describe, afterEach } from "@jest/globals";

import {
  getCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacterById,
} from "./characters";
import { prisma } from "@/lib/prisma";

import { LocalStorage } from "node-localstorage";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    character: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("react", ()=>({
    ...jest.requireActual("react"),
    cache:jest.fn()
}))

jest.mock("node:stream/web");

jest.mock("node-localstorage");


jest.mock("next/cache");

describe("Character functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getCharacters returns all characters", async () => {
    const mockCharacters = [
      { id: "1", name: "Character 1" },
      { id: "2", name: "Character 2" },
    ];
    prisma.character.findMany.mockResolvedValue(mockCharacters);

    const characters = await getCharacters();

    expect(characters).toEqual(mockCharacters);
    expect(prisma.character.findMany).toHaveBeenCalledTimes(1);
  });

  test("createCharacter creates a character", async () => {
    const mockCharacter = { id: "1", name: "Character 1" };
    prisma.character.create.mockResolvedValue(mockCharacter);

    const character = await createCharacter(mockCharacter);

    expect(character).toEqual({ character: mockCharacter });
    expect(prisma.character.create).toHaveBeenCalledWith({
      data: mockCharacter,
    });
  });

  test("updateCharacter updates a character", async () => {
    const mockCharacter = { id: "1", name: "Updated Character" };
    prisma.character.update.mockResolvedValue(mockCharacter);

    const character = await updateCharacter("1", { name: "Updated Character" });

    expect(character).toEqual({ todo: mockCharacter });
    expect(prisma.character.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { name: "Updated Character" },
    });
  });

  test("deleteCharacterById deletes a character", async () => {
    prisma.character.delete.mockResolvedValue(true);

    await deleteCharacterById("1");

    expect(prisma.character.delete).toHaveBeenCalledWith({
      where: { id: "1" },
    });
  });
});

