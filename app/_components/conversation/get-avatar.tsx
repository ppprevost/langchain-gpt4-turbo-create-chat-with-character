import Image from "next/image";

const GetAvatar = ({ isAi }: { isAi: boolean }) => {
  if (isAi) {
    return (
      <Image
        className="w-9 h-9 object-contain"
        width={30}
        height={30}
        src={"/bot.svg"}
        alt={"bot"}
      />
    );
  }
  return (
    <Image
      className="w-9 h-9 object-contain"
      width={30}
      height={30}
      src={"/user.svg"}
      alt={"user"}
    />
  );
};

export default GetAvatar;
