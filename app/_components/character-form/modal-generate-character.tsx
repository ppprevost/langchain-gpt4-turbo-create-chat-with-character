"use client";

import { Modal, Button, Alert } from "react-daisyui";
import { generateAll } from "@/app/_actions";
import Description from "./description";
import SelectLang from "./lang-select";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { forwardRef } from "react";

import { useMutation } from "@tanstack/react-query";

const ModalGenerateCharacter = ({}, ref: any) => {
  const methods = useForm();
  const { reset } = useFormContext();
  const {
    mutate: generateTheCharacterAndImage,
    isPending: isLoadingGeneration,
    isError: isErrorGeneration,
  } = useMutation({
    mutationKey: ["generateCharacter"],
    mutationFn: ({
      description,
      lang,
    }: {
      description: string;
      lang: string;
    }) => generateAll({ description, lang }),
  });

  return (
    <FormProvider {...methods}>
      <Modal
        ref={ref}
        className="w-11/12 max-w-5xl"
        backdrop={!isLoadingGeneration}
      >
        {!isLoadingGeneration && (
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
        )}
        <Modal.Header className="font-bold">Generate Character</Modal.Header>
        <Modal.Body>
          <SelectLang />
          <Description />
          {isErrorGeneration && (
            <Alert status="error">
              An error occured. Please respect policy
            </Alert>
          )}
        </Modal.Body>
        <Modal.Actions>
          <Button
            loading={isLoadingGeneration}
            disabled={isLoadingGeneration}
            onClick={async () => {
              await generateTheCharacterAndImage(
                {
                  description: methods.getValues("description"),
                  lang: methods.watch("lang"),
                },
                {
                  onSuccess: (character) => {
                    reset(character);
                    ref.current?.close();
                  },
                  onError: (error) => {
                    console.log(error);
                  },
                }
              );
            }}
          >
            Create Character
          </Button>
          <form method="dialog">
            <Button disabled={isLoadingGeneration}>Close</Button>
          </form>
        </Modal.Actions>
      </Modal>
    </FormProvider>
  );
};

export default forwardRef(ModalGenerateCharacter);
