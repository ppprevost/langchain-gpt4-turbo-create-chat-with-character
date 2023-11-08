import CharacterForm from "@/app/_components/character-form";
import { getCharacter } from "../../_actions";

export default async function Page({
  params,
}: {
  params: { characterId: string[] };
}) {
  if (params.characterId) {
    const [id] = params.characterId;
    const getActualCharacter = await getCharacter(id);

    return <CharacterForm character={getActualCharacter} />   ;
  }
  return <CharacterForm />;
}
