import { deleteConversation, getCharacters } from "@/app/_actions";
import CharactersList from "@/app/_components/characters-list";
import Presentation from "@/app/_components/presentation";
import TextareaChat from "@/app/_components/textarea";
import ChatContainer from "@/app/_components/conversation/chat-container";
import { revalidatePath } from "next/cache";

const Page = async ({ params }: { params: { characterId: string[] } }) => {
  const characters = await getCharacters();
  const characterId = params.characterId;
  console.log(characterId);

  const id = characterId?.[0];

  return (
    <div className="container">
      <div className="prose mt-2">
        <h1>Character List</h1>
      </div>

      <section className=" mt-8 grid grid-cols-2 gap-4 md:mt-10 md:grid-cols-4 lg:mt-28 lg:gap-10">
        <CharactersList characters={characters} />
      </section>
      <hr className="my-4" />

      <section>
        {id && (
          <>
            <div className="prose mt-4">
              <h2>Chat</h2>
            </div>
            <form>
              <button
                formAction={async () => {
                  "use server";
                  deleteConversation(id);
                  revalidatePath("/chat/" + id);
                }}
                className="btn btn-error"
              >
                Delete conversation
              </button>
            </form>

            <Presentation id={id} />
            <ChatContainer id={id} />
            <TextareaChat id={id} />
          </>
        )}
      </section>
    </div>
  );
};

export default Page;
