import { revalidatePath } from "next/cache";
import { LocalStorage } from "node-localstorage";
import { updateLocalMessagesServer } from "../_actions";

const TextareaChat = async ({ id }: { id: string }) => {
  return (
    <form className="flex gap-2 p-2 w-full bg-[#4a4a58]">
      <textarea
        className={"textarea w-full bg-[#4a4a58]"}
        name="message"
        rows={1}
        cols={1}
        placeholder={"send message"}
      />
      <button
        formAction={async (formData) => {
          "use server";
          await updateLocalMessagesServer(
            id,
            formData.get("message") as string
          );
          revalidatePath("/chat/" + id);
        }}
        type="submit"
        disabled={false}
      >
        <div className="flex align-middle">
          <i className="book" />
          send
        </div>
      </button>
    </form>
  );
};

export default TextareaChat;
