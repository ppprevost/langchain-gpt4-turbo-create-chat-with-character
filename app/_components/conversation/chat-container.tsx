"use client";


import { useState } from "react";
import { useParams } from "next/navigation";
import ChatStripe from "./chat-stripe";
import { useCallback, useEffect } from "react";
import GetAvatar from "./get-avatar";
import { getMessagesByCharacterId, loadAiAnswer } from "@/app/_actions";
import { MessageSchemaType } from "@/lib/validation";

const ChatContainer = () => {
  const params = useParams<>();

  const [messages, setMessages] = useState<MessageSchemaType[]>([]);

  useEffect(() => {
    getMessagesByCharacterId(params.characterId[0]).then((msgs) =>
      setMessages(msgs)
    );
  }, [params]);

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].user === "user") {
      const msg = messages[messages.length - 1].message;
      loadAiAnswer(params.characterId[0], msg);
    }
  }, [messages]);

  const isAi = useCallback((messageObject) => {
    return messageObject.user !== "user";
  }, []);

  return (
    <>
      {messages?.map((messageObject) => {
        return (
          <ChatStripe
            isAi={messageObject.user === "user"}
            key={messageObject.id}
          >
            <div
              className={`w-9 h-9 rounded-5 ${
                isAi(messageObject)
                  ? "cursor-pointer bg-green-500"
                  : "bg-purple-600"
              } flex justify-center items-center`}
            >
              <GetAvatar isAi={isAi(messageObject)} />
            </div>

            <div
              className={`flex-1 ${
                messageObject.error ? "text-red-500" : "text-gray-400"
              } whitespace-break-spaces text-lg max-w-full overflow-x-scroll`}
            >
              {messageObject.message}
            </div>
          </ChatStripe>
        );
      })}
    </>
  );
};

export default ChatContainer;
