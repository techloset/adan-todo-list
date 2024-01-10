"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

import { useState } from "react";

import LogoutModel from "@/components/model/logout-model";
import styles from "./List.module.css";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/config/database";
import Loader from "@/components/Loader";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { ListType } from "@/type/Type";
const theme = {
  "Vintage Garden": {
    primary: "#2D4659",
    background: "#FDFBDA",
    accent: "#819F7F",
  },
  "Cosmic Symphony": {
    primary: "#F0EB8D",
    background: "#413543",
    accent: "#8F43EE",
  },
  "Rustic Charm": {
    primary: "#EA5455",
    background: "#F9F5EB",
    accent: "#E4BD7D",
  },
  "Sunset Serenade": {
    primary: "#210062",
    background: "#009FBD",
    accent: "#77037B",
  },
  "Industrial Chic": {
    primary: "#F45050",
    background: "#F0F0F0",
    accent: "#F9D949",
  },
  "Blackout Neutrals": {
    primary: "#F3EFE0",
    background: "#222222",
    accent: "#22A39F",
  },
  "Vibrant Spectrum": {
    primary: "#4A0E5C",
    background: "#CCF0C3",
    accent: "#BCA3CA",
  },
  "Coastal Sunrise": {
    primary: "#005874",
    background: "#E6E6D4",
    accent: "#FFBE00",
  },
  "Oceanic Serenity": {
    primary: "#CBE4DE",
    background: "#2C3333",
    accent: "#2E4F4F",
  },
};
export default function Home() {
  const [list, setList] = useState<ListType[]>([]);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [user] = useAuthState(auth);

  const getListHandler = async () => {
    setIsLoading(true);
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    const uid = user.uid;
    try {
      const q = query(collection(db, "list"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      let datalist: ListType[] = [];

      querySnapshot.forEach((doc) => {
        datalist.push({
          name: doc.data().name,
          id: doc.id,
          uid: doc.data().uid,
          theme: doc.data().theme,
        });
      });

      setList(datalist);
    } catch (error) {
      console.error("Error fetching list data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getListHandler();
  }, []);

  const onDeleteHandler = async (listId: string) => {
    try {
      const todoQuery = query(
        collection(db, "todo"),
        where("listId", "==", listId)
      );
      const todoSnapshot = await getDocs(todoQuery);

      todoSnapshot.forEach(async (todoDoc) => {
        await deleteDoc(doc(db, "todo", todoDoc.id));
      });

      await deleteDoc(doc(db, "list", listId));

      let filteredList = list.filter((e: ListType) => e.id !== listId);
      setList(filteredList);

      toast.success("Successfully deleted");
    } catch (error) {
      console.error("Error", error);
      toast.error("Something went wrong, please try again");
    }
  };

  return (
    <>
      {open && <LogoutModel isOpen={open} onClose={() => setOpen(false)} />}

      <div className="Black-orange-bg font-bold pb-10 lg:h-screen h-auto  text-[#F4F4F4]">
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
        <h1 className="lg:text-[96px] md:text-[69px]  font-normal text-[48px]  pb-10 flex items-center justify-center font-Stint">
          Todo Lists<div className="text-[#FF7315]">.</div>
        </h1>
        <div className="max-w-[85%] md:max-w-[80%] lg:max-w-[70%] mx-auto font-black text-[24px] sm:text-[36px] md:text-[48px] lg:text-[56px]">
          {/* Lists */}
          {isLoading ? (
            <div className="mt-10 mx-auto ">
              <Loader />
            </div>
          ) : (
            list.map((item: ListType, index: number) => {
              const bgcolor = item.theme.name.split(" ")[0];
              return (
                <div
                  className="flex flex-row justify-between items-center pb-4"
                  key={index}
                >
                  <h3
                    className={`w-fit inline-block relative z-[100] ${styles.background_animation} ${bgcolor}`}
                  >
                    <Link href={`/dashboard/todos/${item.id}`}>
                      {item.name}
                    </Link>
                  </h3>
                  <div className="flex flex-row gap-[16px] md:gap-[24px] lg:gap-[36px]">
                    <Link href={`/dashboard/edit/${item.id}`}>
                      <Image
                        src="/edit.svg"
                        alt="delete"
                        height={50}
                        width={50}
                        className="w-[24px] md:w-[36px] lg:w-[48px]"
                      />
                    </Link>
                    <button onClick={() => onDeleteHandler(item.id)}>
                      <Image
                        src="/delete.svg"
                        alt="delete"
                        height={50}
                        width={50}
                        className="w-[24px] md:w-[36px] lg:w-[48px]"
                      />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          <button
            className={`w-fit inline-block relative  z-[100]  ${styles.background_animation} after:bg-[#ff6600]`}
          >
            <Link href={"/dashboard/newList"}> + add new</Link>
          </button>
        </div>
      </div>
    </>
  );
}
