"use client";

import { PaperPlaneRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

const SendButton = () => {
  const { pending } = useFormStatus();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (pending) {
      setValue("");
    }
  }, [pending]);

  return (
    <>
      <textarea
        disabled={pending}
        className={"textarea w-full bg-[#4a4a58]"}
        name="message"
        rows={1}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        cols={1}
        placeholder={"send message"}
      />

      <button type="submit" aria-disabled={pending} disabled={pending}>
        <PaperPlaneRight size={22} weight="fill" />
      </button>
    </>
  );
};

export default SendButton;
