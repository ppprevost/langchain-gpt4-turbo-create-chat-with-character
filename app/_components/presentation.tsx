import Image from "next/image";

import { capitalize } from "lodash";
import { actualMood } from "@/lib/utils";
import { getCharacter } from "@/app/_actions";

const Presentation = async ({ id }: { id: string }) => {
  const {
    image = "",
    name: character,
    description,
    lang = "en",
    mood,
    temperature,
  } = await getCharacter(id);

  const temperatureString = () => {
    if (temperature) {
      const temp = Number(temperature);
      if (temp < 0.4) {
        return "severe";
      }
      if (temp > 0.4 && temp < 0.6) {
        return "fair";
      }
      if (temp > 0.6) {
        return "creative";
      }
    }
  };

  return (
    <div className="max-h-72 lg:max-h-full overflow-scroll mt-2 flex flex-col gap-6 rounded-lg  p-6 md:gap-8">
      <div className="flex gap-8">
        <Image
          src={image}
          alt="User Photo"
          width="120"
          height="120"
          className="h-28 w-28"
        />
        <div className="text-white flex flex-col  gap-1 md:justify-around">
          <div className="flex flex-col md:flex-row items-center gap-2 align-middle space-x-2">
            <div className="text-2xl font-semibold">
              {capitalize(character)}
            </div>
            <div className="badge">{lang === "en" ? "gb" : lang}</div>
            <div className="flex gap-2">
              {actualMood(mood) && (
                <div className="badge badge-primary" color="primary">
                  {actualMood(mood)}
                </div>
              )}
              {temperatureString && (
                <div className="badge badge-secondary" color="secondary">
                  {temperatureString()}
                </div>
              )}
            </div>
          </div>
          <div className="-mb-6 hidden break-words md:block">
            <div className="text-neutral-300 whitespace-pre-line break-words text-justify ">
              {description}
            </div>
            <div className="opacity-0">0</div>
          </div>
        </div>
      </div>
      <div className="-mb-6 block break-words md:hidden">
        <p className="text-white whitespace-pre-line break-words text-justify ">
          {description}
        </p>
        <div className="opacity-0">0</div>
      </div>
      <div className="text-sm text-gray-700">{"ⓘ " + "answerGenerated"}</div>
    </div>
  );
};

export default Presentation;
