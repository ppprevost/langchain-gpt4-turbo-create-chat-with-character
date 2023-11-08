"use client";

import { deleteCharacterById } from "@/app/_actions";
import { useMutation } from "@tanstack/react-query";
import { Link, Modal, Button } from "react-daisyui";
import { useCallback, useRef } from "react";

const ButtonDeleteCharacter = ({ id }: { id: string }) => {
  const { mutate: deleteTheCharacter } = useMutation({
    mutationFn: (id) => deleteCharacterById(id),
  });
  const ref = useRef<HTMLDialogElement>(null);

  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);
  return (
    <>
      <div className="">
        <Modal ref={ref} className="w-11/12 max-w-5xl">
          <Modal.Header>
            <form method="dialog">
              <Button
                size="sm"
                color="ghost"
                shape="circle"
                className="absolute right-2 top-2"
              >
                x
              </Button>
            </form>
            Delete Character
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this character?</p>
          </Modal.Body>
          <Modal.Actions>
            <Button color="error" onClick={() => deleteTheCharacter(id)}>
              {"delete"}
            </Button>
            <form method="dialog">
              <Button>Close</Button>
            </form>
          </Modal.Actions>
        </Modal>
      </div>

      <Link
        color="error"
        onClick={() => handleShow()}
        className="block cursor-pointer"
      >
        {"delete"}
      </Link>
    </>
  );
};

export default ButtonDeleteCharacter;
