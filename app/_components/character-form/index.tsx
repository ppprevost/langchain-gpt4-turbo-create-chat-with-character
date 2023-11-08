"use client";

import { generateCharacterImage, updateCharacter } from "@/app/_actions";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Button,
  Input,
  Textarea,
  Toggle,
  Range,
  Alert,
  Link,
  Loading,
  FileInput,
} from "react-daisyui";
import { redirect } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import ModalGenerateCharacter from "./modal-generate-character";
import { CharacterSchemaType } from "@/lib/validation";
import Image from "next/image";
import Wrapper from "./wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectLang from "./lang-select";
import { createCharacter } from "@/app/_actions";
import { z } from "zod";
import { validationCreateOrUpdateCharacterSchema } from "@/lib/validation";
import Faq from "./faq";
import { useMutation } from "@tanstack/react-query";

interface CharacterBuilderProps {
  character?: CharacterSchemaType;
}

export type FormValues = z.infer<
  typeof validationCreateOrUpdateCharacterSchema
>;

const CharacterBuilder = ({ character }: CharacterBuilderProps) => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(validationCreateOrUpdateCharacterSchema),
  });

  const {
    mutate: createOrUpdateTheCharacter,
    isSuccess: isSuccessCreateOrUpdateCharacter,
    isPending: isLoadingCreateOrUpdateCharacter,
    isError: isErrorCreateOrUpdateCharacter,
  } = useMutation<unknown, unknown, FormValues>({
    mutationFn: (data: FormValues) =>
      character ? updateCharacter(character.id, data) : createCharacter(data),
    mutationKey: ["postCharacter"],
  });

  const {
    mutate: generateTheCharacterImage,
    isPending: isLoadingGenerationImage,
  } = useMutation({
    mutationFn: (description: string) => generateCharacterImage(description),
  });

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (Number(data.temperature) > 1) {
        data.temperature = (Number(data.temperature) / 100).toString();
      }

      await createOrUpdateTheCharacter(data);
    },
    [createOrUpdateTheCharacter]
  );
console.log(methods.formState);

  useEffect(() => {
    if (character) {
      methods.reset({
        name: character.name,
        image: character?.image,
        description: character?.description,
        tips: character.tips,

        prompt: character?.prompt,
        mood: character.mood,
        lang: character.lang,
        temperature: (Number(character.temperature) * 100).toString(),
      });
    }
  }, [character, methods]);

  useEffect(() => {
    if (isSuccessCreateOrUpdateCharacter) {
      redirect("/");
    }
  }, [isSuccessCreateOrUpdateCharacter]);

  methods.watch("mood");

  const moodColor = () => {
    const mood = Number(methods.getValues("mood"));
    if (mood < 30) {
      return "error";
    }
    if (mood >= 30 && mood <= 70) {
      return "warning";
    }
    if (mood > 70) {
      return "success";
    }
  };

  const ref = useRef<HTMLDialogElement>(null);
  const watchImage = methods.watch("image");

  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const isValidImageURl = useMemo(() => {
    try {
      z.string().url().parse(watchImage);
    } catch (err) {
      return false;
    }
    return true;
  }, [watchImage]);

  return (
    <FormProvider {...methods}>
      <ModalGenerateCharacter ref={ref} />
      <h1 className="text-white text-center md:text-3xl lg:text-5xl my-5">
        {character ? "Update character" : "Create character"}
      </h1>
      {!character && (
        <Button
          color="primary"
          className="mx-auto block mb-5"
          onClick={async () => {
            handleShow();
          }}
        >
          Generate Character
        </Button>
      )}
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="lg:w-3/6 md:w-5/6 mx-auto  "
      >
        <div className="grid grid-cols-1">
          <div>
            <Wrapper
              error={methods.formState.errors.name?.message}
              name={"name"}
            >
              <Input
                placeholder="the name of your character"
                color={methods.formState.errors.name ? "error" : "neutral"}
                className=""
                {...methods.register("name")}
              />
            </Wrapper>

            <Wrapper
              error={methods.formState.errors.image?.message}
              name="imageUrl"
            >
              {!isLoadingGenerationImage && (
                <Input
                  placeholder="the image url of your character image"
                  color={methods.formState.errors.image ? "error" : "neutral"}
                  {...methods.register("image")}
                />
              )}
              {methods.watch("image") &&
                !isLoadingGenerationImage &&
                isValidImageURl && (
                  <Image
                    className="mt-4"
                    width={256}
                    height={256}
                    alt="character image"
                    src={methods.getValues("image") as string}
                  />
                )}
              {isLoadingGenerationImage && <Loading />}
              {methods.getValues("description") &&
                !isLoadingGenerationImage && (
                  <Link
                    color="primary"
                    onClick={async () => {
                      await generateTheCharacterImage(
                        methods.getValues("description"),
                        {
                          onSuccess: (url: string) => {
                            methods.setValue("image", url);
                          },
                          onError(error) {
                            alert((error as Error).message);
                          },
                        }
                      );
                    }}
                  >
                    generate
                  </Link>
                )}
            </Wrapper>
            <SelectLang />
          </div>

          <div>
            <Wrapper
              error={methods.formState.errors.description?.message}
              name="presentation_character"
            >
              <Textarea
                placeholder="the description of your character"
                color={
                  methods.formState.errors.description ? "error" : "neutral"
                }
                {...methods.register("description")}
              />
            </Wrapper>

            <Wrapper error={methods.formState.errors.tips?.message} name="tips">
              <Textarea
                placeholder="tips to give to the user to ask good questions to your character"
                color={methods.formState.errors.tips ? "error" : "neutral"}
                {...methods.register("tips")}
              />
            </Wrapper>

            <Wrapper
              error={methods.formState.errors.temperature?.message}
              name="flexibility"
            >
              <Range
                step={10}
                color={
                  methods.formState.errors.temperature ? "error" : "neutral"
                }
                size="sm"
                {...methods.register("temperature")}
              />
            </Wrapper>

            <Wrapper error={methods.formState.errors.mood?.message} name="mood">
              <Range
                step={10}
                size="sm"
                color={moodColor()}
                {...methods.register("mood")}
              />
            </Wrapper>
          </div>
        </div>
        <Wrapper error={methods.formState.errors.prompt?.message} name="prompt">
          <Textarea
            placeholder="the prompt to send to the model. Use it to say to the LLM who are you and how to behave"
            color={methods.formState.errors.prompt ? "error" : "neutral"}
            {...methods.register("prompt")}
          />
        </Wrapper>

        <Button
          loading={
            methods.formState.isSubmitting || isLoadingCreateOrUpdateCharacter
          }
          className="block float-right my-2"
          type="submit"
        >
          {"submit character"}
        </Button>
        {methods.formState.isSubmitSuccessful &&
          isSuccessCreateOrUpdateCharacter && (
            <Alert status="success">Great your character is now live</Alert>
          )}
        {isErrorCreateOrUpdateCharacter && (
          <Alert status="error">an error occured</Alert>
        )}
      </form>
    </FormProvider>
  );
};

export default CharacterBuilder;
