import { revalidatePath } from "next/cache";
import { updateLocalMessagesServer } from "../_actions";
import SendButton from "./send-button";

const TextareaChat = async ({ id }: { id: string }) => {
  return (
    <form
      action={async (formData) => {
        "use server";
        const message = formData.get("message") as string;
        await updateLocalMessagesServer(id, message);
        revalidatePath("/chat/" + id);
      }}
      className="flex mb-6 gap-2 p-2 w-full bg-[#4a4a58]"
    >
     
      <SendButton />
    </form>
  );
};

export default TextareaChat;
