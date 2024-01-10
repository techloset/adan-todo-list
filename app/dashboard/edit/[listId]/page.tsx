"use client";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

import LogoutModel from "@/components/model/logout-model";

import toast from "react-hot-toast";
import { db } from "@/config/database";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ListType, ThemeType } from "@/type/Type";
import Loader from "@/components/Loader";

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
export default function Home({ params }: { params: { listId: string } }) {
  const [theme, setTheme] = useState<ThemeType | undefined>();
  const [list, setList] = useState<ListType | undefined>();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const router = useRouter();

  const onGetHandler = async () => {
    try {
      if (!params.listId) {
        return null;
      }
      setIsLoading(true);
      const listId = params.listId;
      const listDocRef = doc(db, "list", listId);
      const listDocSnapshot = await getDoc(listDocRef);

      if (listDocSnapshot.exists()) {
        const listData = listDocSnapshot.data();
        if (listData && listData.theme) {
          setList({
            id: listDocSnapshot.id,
            name: listData.name,
            uid: listData.uid,
            theme: listData.theme,
          });
          setIsLoading(false);
        } else {
          console.error("Error: Invalid data structure in the document");
          toast.error("Something went wrong, please try again");
          router.push("/");
          setIsLoading(false);
        }
      } else {
        console.error("Error: Document does not exist");
        toast.error("List not found");
        router.push("/");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Something went wrong, please try again");
      router.push("/");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    onGetHandler();
  }, []);

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
      return toast.error("Please select another theme");
    }
    if (!list?.name || list?.name == "") {
      return toast.error("Please fill the field");
    }
    try {
      setIsLoader(true);
      await updateDoc(doc(db, "list", list.id), {
        name: list.name,
        theme,
      });
      toast.success("List successfully updated");
      router.push("/dashboard");
    } catch (error) {
      console.log("-------------------------------------");
      console.log(error);
      console.log("-------------------------------------");
      setIsLoader(true);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  if (!list?.theme.Bg) {
    return null;
  }

  return (
    <>
      {open && <LogoutModel isOpen={open} onClose={() => setOpen(false)} />}
      <div
        style={{
          backgroundImage: `radial-gradient(${
            theme?.Bg || list.theme.Bg
          } 1.5px, transparent 1.5px), radial-gradient(${
            theme?.Bg || list.theme.Bg
          } 1.5px, transparent 1.5px)`,
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0, 15px 15px",
        }}
        className={` ${
          theme?.BgColor ? theme.BgColor : list.theme.BgColor
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
            value={list.name}
            disabled={isLoader}
            onChange={(e) =>
              setList((prevList: any) => ({
                ...prevList,
                name: e.target.value,
              }))
            }
            className={`inline-block w-[90%] sm:w-[70%] font-[900]  md:w-[60%] lg:w-[45%]  focus-visible:outline-none rounded-full border-[5px] py-[10px] px-[14px] lg:py-[12px] md:px-[24px] lg:px-[36px] text-[18px] md:text-[24px] lg:text-[30px] ${
              theme?.textColor ? theme.textColor : list.theme.textColor
            } ${theme?.BgColor ? theme.BgColor : list.theme.BgColor} ${
              theme?.borderColor ? theme.borderColor : list.theme.borderColor
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
              theme?.buttonColor ? theme.buttonColor : list.theme.buttonColor
            } ${
              theme?.buttonBgColor
                ? theme.buttonBgColor
                : list.theme.buttonBgColor
            }  ${isLoader && "opacity-75"} `}
          >
            Add List.
          </button>
        </form>
      </div>
    </>
  );
}
