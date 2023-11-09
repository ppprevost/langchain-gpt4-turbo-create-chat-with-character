"use server";

import { FormValues } from "@/app/_components/character-form";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export async function getCharacters() {
  try {
    const characters = await prisma.character.findMany();

    return characters;
  } catch (error) {
    return { error };
  }
}

export async function createCharacter(data: FormValues) {
  try {
    const character = await prisma.character.create({
      data: { ...data },
    });
    return { character };
  } catch (error) {
    console.log(error);

    return { error };
  }
}

export const getCharacter = cache(async function (id: string) {
  const character = await prisma.character.findUnique({
    where: { id },
  });
  return character;
});

export async function updateCharacter(id: string, data: FormValues) {
  try {
    const todo = await prisma.character.update({
      where: { id },
      data,
    });
    return { todo };
  } catch (error) {
    return { error };
  }
}

export async function deleteCharacterById(id: string) {
  try {
    await prisma.character.delete({ where: { id } });
  } catch (error) {
    return { error };
  }
}
