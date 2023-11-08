import { capitalize } from "lodash";
import Link from "next/link";
import Image from "next/image";
import { CharacterSchemaType } from "@/lib/validation";
import ButtonDeleteCharacter from "./button-delete";

const CharactersList = async ({
  characters,
  edit = true,
}: {
  characters: CharacterSchemaType[];
  edit?: boolean;
}) => {
  return characters?.map((l) => (
    <div key={l.name}>
      <div className={"text-center relative"}>
        <span className="absolute right-2 z-50 ">{l.lang}</span>

        <Link key={l.name} href={"/chat/" + l.id}>
          <div
            className={
              "cursor-pointer relative group overflow-hidden h-full w-full rounded-full bg-white hover:rotate-12 transition duration-300 ease-in-out"
            }
          >
            {l.image && (
              <Image
                width={400}
                height={400}
                src={l.image}
                alt={l.name}
                className="object-cover w-full aspect-square group-hover:scale-110 transition duration-300 ease-in-out"
              />
            )}
          </div>
        </Link>
        <span className={"width-100 text-center text-white mt-3"}>
          {capitalize(l.name)}
        </span>
        <span className="block">
          {edit && (
            <Link className="text-blue-300 " href={"/character/" + l.id}>
              {"edit"}
            </Link>
          )}
          {edit && <ButtonDeleteCharacter id={l.id} />}
        </span>
      </div>
    </div>
  ));
};

export default CharactersList;
