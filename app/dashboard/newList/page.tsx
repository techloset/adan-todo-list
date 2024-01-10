"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

import LogoutModel from "@/components/model/logout-model";

import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/config/database";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ThemeType } from "@/type/Type";

const dataTheme: ThemeType[] = [
  {
    name: "Vintage Garden",
    textColor: "text-[#2D4659]",
    buttonColor: "text-[#FDFBDA]",
    Bg: "#819F7F",
    BgColor: "bg-[#FDFBDA]",
    buttonBgColor: "bg-[#819F7F]",
    borderColor: "border-[#819F7F]",
  },
  {
    name: "Cosmic Symphony",
    textColor: "text-[#F0EB8D]",
    buttonColor: "text-[#413543]",
    Bg: "#8F43EE",
    BgColor: "bg-[#413543]",
    buttonBgColor: "bg-[#8F43EE]",
    borderColor: "border-[#8F43EE]",
  },
  {
    name: "Rustic Charm",
    textColor: "text-[#EA5455]",
    buttonColor: "text-[#F9F5EB]",
    Bg: "#E4BD7D",
    BgColor: "bg-[#F9F5EB]",
    buttonBgColor: "bg-[#E4BD7D]",
    borderColor: "border-[#E4BD7D]",
  },
  {
    name: "Sunset Serenade",
    textColor: "text-[#210062]",
    buttonColor: "text-[#009FBD]",
    Bg: "#77037B",
    BgColor: "bg-[#009FBD]",
    buttonBgColor: "bg-[#77037B]",
    borderColor: "border-[#77037B]",
  },
  {
    name: "Industrial Chic",
    textColor: "text-[#F45050]",
    buttonColor: "text-[#F0F0F0]",
    Bg: "#F9D949",
    BgColor: "bg-[#F0F0F0]",
    buttonBgColor: "bg-[#F9D949]",
    borderColor: "border-[#F9D949]",
  },
  {
    name: "Blackout Neutrals",
    textColor: "text-[#F3EFE0]",
    buttonColor: "text-[#222222]",
    Bg: "#22A39F",
    BgColor: "bg-[#222222]",
    buttonBgColor: "bg-[#22A39F]",
    borderColor: "border-[#22A39F]",
  },
  {
    name: "Vibrant Spectrum",
    textColor: "text-[#4A0E5C]",
    buttonColor: "text-[#CCF0C3]",
    Bg: "#BCA3CA",
    BgColor: "bg-[#CCF0C3]",
    buttonBgColor: "bg-[#BCA3CA]",
    borderColor: "border-[#BCA3CA]",
  },
  {
    name: "Coastal Sunrise",
    textColor: "text-[#005874]",
    buttonColor: "text-[#E6E6D4]",
    Bg: "#FFBE00",
    BgColor: "bg-[#E6E6D4]",
    buttonBgColor: "bg-[#FFBE00]",
    borderColor: "border-[#FFBE00]",
  },
  {
    name: "Oceanic Serenity",
    textColor: "text-[#CBE4DE]",
    buttonColor: "text-[#2C3333]",
    Bg: "#2E4F4F",
    BgColor: "bg-[#2C3333]",
    buttonBgColor: "bg-[#2E4F4F]",
    borderColor: "border-[#2E4F4F]",
  },
];
export default function Home() {
  const [theme, setTheme] = useState<ThemeType | undefined>();
  const [name, setName] = useState("");

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [user] = useAuthState(auth);
  const router = useRouter();
  const onThemeHandler = (
    item: ThemeType,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setTheme(item);
  };
  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!theme) {
      return toast.error("Please select an theme");
    }
    if (!name) {
      return toast.error("Please fill the input");
    }
    try {
      setIsLoading(true);
      if (!user?.uid) {
        return toast.error("Something went wrong please Login again");
      }
      const newDoc = {
        name,
        theme,
        uid: user.uid,
      };
      await addDoc(collection(db, "list"), newDoc);
      toast.success("List successfully added");
      router.push("/dashboard");
    } catch (error) {
      console.log("-------------------------------------");
      console.log(error);
      console.log("-------------------------------------");
      setIsLoading(false);
    }
  };
  return (
    <>
      {open && <LogoutModel isOpen={open} onClose={() => setOpen(false)} />}
      <div
        style={{
          backgroundImage: `radial-gradient(${
            theme?.Bg || "#4f4c4b"
          } 1.5px, transparent 1.5px), radial-gradient(${
            theme?.Bg || "#4f4c4b"
          } 1.5px, transparent 1.5px)`,
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0, 15px 15px",
        }}
        className={` ${
          theme?.BgColor ? theme.BgColor : "bg-[#232020]"
        } lg:h-screen h-auto `}
      >
        <div className=" sticky top-0 left-0 flex justify-between items-center px-6 py-6">
          <Link href={"/"}>
            <Image src="/logo.svg" alt="Logo" height={50} width={50} />
          </Link>
          <div
            onClick={() => setOpen(true)}
            className="bg-rose-500 rounded-2xl p-3 cursor-pointer "
          >
            <Image src="/log-out.svg" alt="log out" height={25} width={25} />
          </div>
        </div>
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col items-center justify-center   py-[40px] gap-[40px] "
        >
          <input
            type="text"
            name="text"
            value={name}
            disabled={isLoading}
            onChange={(e) => setName(e.target.value)}
            className={`inline-block w-[90%] sm:w-[70%] font-[900]  md:w-[60%] lg:w-[45%]  focus-visible:outline-none rounded-full border-[5px] py-[10px] px-[14px] lg:py-[12px] md:px-[24px] lg:px-[36px] text-[18px] md:text-[24px] lg:text-[30px] ${
              theme?.textColor ? theme.textColor : "text-[#F4F4F4]"
            } ${theme?.BgColor ? theme.BgColor : "bg-[#232020]"} ${
              theme?.borderColor ? theme.borderColor : "border-[#FF7315]"
            }`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {dataTheme.map((item: ThemeType, index: number) => (
              <button
                key={index}
                onClick={(event) => onThemeHandler(item, event)}
                className={`  cursor-pointer text-center font-[900] inline-block px-[36px] py-[12px] m-[16px] rounded-full border-[5px] ${item.textColor} ${item.BgColor} ${item.borderColor} ${item.borderColor}`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className={`text-[18px] font-[900]  md:text-[24px] lg:text-[30px] rounded-full px-[32px] py-[16px] ${
              theme?.buttonColor ? theme.buttonColor : "text-[#232020]"
            } ${theme?.buttonBgColor ? theme.buttonBgColor : "bg-[#FF7315]"}  ${
              isLoading && "opacity-75"
            } `}
          >
            Add List.
          </button>
        </form>
      </div>
    </>
  );
}
