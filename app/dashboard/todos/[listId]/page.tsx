"use client";
import Loader from "@/components/Loader";
import LogoutModel from "@/components/model/logout-model";
import { db } from "@/config/database";
import { ListType, TodoType } from "@/type/Type";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Check, Pen, Trash2 } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home({ params }: { params: { listId: string } }) {
  const [list, setList] = useState<ListType | undefined>();
  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [id, setId] = useState("");

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

      const listData = listDocSnapshot.data();
      if (listData && listData.theme) {
        const todoCollectionRef = collection(db, "todo");
        const todoQuery = query(
          todoCollectionRef,
          where("listId", "==", listId)
        );
        const todoSnapshot = await getDocs(todoQuery);
        const todoData = todoSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (todoData) {
          setList({
            id: listDocSnapshot.id,
            name: listData.name,
            uid: listData.uid,
            theme: listData.theme,
            todo: todoData,
          });
        } else {
          setList({
            id: listDocSnapshot.id,
            name: listData.name,
            uid: listData.uid,
            theme: listData.theme,
          });
        }
        setIsLoading(false);
      } else {
        console.error("Error: Invalid data structure in the document");
        toast.error("Something went wrong, please try again");
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

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!list?.theme.buttonBgColor) {
    return null;
  }

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || input == "") {
      return toast.error("Please fill the field");
    }
    if (!update) {
      try {
        const newDoc = {
          input,
          checked: false,
          listId: params.listId,
        };
        const docRef1 = await addDoc(collection(db, "todo"), newDoc);
        setList((prevList) => {
          if (prevList) {
            return {
              ...prevList,
              todo: [...prevList.todo, { ...newDoc, id: docRef1.id }],
            };
          }
        });
        toast.success("todo successfully added");
        setInput("");
      } catch (error) {
        console.log("-------------------------------------");
        console.log(error);
        console.log("-------------------------------------");
      }
    } else {
      const todoDocRef = doc(db, "todo", id);
      await updateDoc(todoDocRef, {
        input,
      });

      setList((prevList) => {
        if (prevList) {
          const updatedTodoList = prevList.todo.map((todo: TodoType) => {
            if (todo.id === id) {
              return {
                ...todo,
                input,
              };
            }
            return todo;
          });
          return {
            ...prevList,
            todo: updatedTodoList,
          };
        }
        return prevList;
      });

      toast.success("Todo successfully updated");
      setInput("");
      setUpdate(false);
      try {
      } catch (error) {
        console.log("-------------------------------------");
        console.log(error);
        console.log("-------------------------------------");
      }
    }
  };

  const onDeleteHandler = async (todoId: string) => {
    try {
      await deleteDoc(doc(db, "todo", todoId));
      setList((prevList) => {
        if (prevList && prevList.todo) {
          let filteredList: TodoType[] = prevList.todo.filter(
            (e: TodoType) => e.id !== todoId
          );
          return {
            ...prevList,
            todo: filteredList,
          };
        }
        return prevList;
      });

      toast.success("Successfully deleted");
    } catch (error) {
      console.error("Error", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const onToggleCheckedHandler = async (todoId: string) => {
    try {
      const todoDocRef = doc(db, "todo", todoId);
      await updateDoc(todoDocRef, {
        checked: true,
      });

      setList((prevList) => {
        if (prevList) {
          const updatedTodoList = prevList.todo.map((todo: TodoType) => {
            if (todo.id === todoId) {
              return {
                ...todo,
                checked: !todo.checked,
              };
            }
            return todo;
          });
          return {
            ...prevList,
            todo: updatedTodoList,
          };
        }
        return prevList;
      });

      toast.success("Todo status updated");
    } catch (error) {
      console.error("Error updating todo status:", error);
      toast.error("Something went wrong, please try again");
    }
  };

  const onUpdate = (item: TodoType) => {
    setUpdate(true);
    setInput(item.input);
    setId(item.id);
  };

  return (
    <>
      {open && <LogoutModel isOpen={open} onClose={() => setOpen(false)} />}
      <div>
        <div
          style={{
            backgroundImage: `radial-gradient(${list.theme.Bg} 1.5px, transparent 1.5px), radial-gradient(${list.theme.Bg} 1.5px, transparent 1.5px)`,
            backgroundSize: "30px 30px",
            backgroundPosition: "0 0, 15px 15px",
          }}
          className={` ${list.theme.BgColor} lg:h-screen h-auto `}
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

          <div
            className={`flex justify-center items-end font-Stint lg:text-[96px] md:text-[69px] text-[48px] text-center pb-6 lg:pb-10 leading-[120%] ${list.theme.textColor} `}
          >
            Hello
            <div
              style={{
                color: list.theme.Bg,
              }}
            >
              .
            </div>
          </div>
          <form
            className="flex gap-[20px] lg:gap-[40px] flex-col md:flex-row justify-center flex-wrap pb-10"
            onSubmit={onSubmitHandler}
          >
            <input
              type="text"
              name="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`max-w-[80vw] ${list.theme.BgColor} ${list.theme.borderColor} ${list.theme.textColor} mx-[10%] md:mx-0 inline-block focus-visible:outline-none rounded-full border-[5px] py-[10px] px-[14px] lg:py-[12px] md:px-[24px] lg:px-[36px] text-[18px] md:text-[24px] lg:text-[30px]`}
            />
            <button
              type="submit"
              className={`block ${list.theme.buttonBgColor} ${list.theme.textColor} text-[18px] md:text-[24px] lg:text-[30px] rounded-full min-w-[200px] mx-[10%] md:mx-0 h-[59px] md:h-[80px]`}
            >
              {update ? "Update Task" : "Add Task"}
            </button>
          </form>
          <div className="mx-auto text-[20px] md:text-[30px] lg:text-[40px] max-w-[90%] lg:max-w-[85%]">
            {/* map here */}
            {list?.todo.map((todo: TodoType, index: number) => (
              <div
                key={index}
                className="flex flex-row justify-between gap-2 lg:gap-4 items-center lg:[&>div>button]:opacity-0 [&>div>button]:hover:opacity-100 pb-4"
              >
                <div className="flex flex-row justify-between gap-2 lg:gap-4 items-middle w-[70%] md:w-[80%] lg:w-[90%]">
                  <div
                    onClick={() => onToggleCheckedHandler(todo.id)}
                    className={`${list.theme.borderColor} ${list.theme.BgColor} min-w-[32px] h-[32px] lg:min-w-[42px] lg:h-[42px] rounded-[6px] border-2 md:border-[3px] lg:border-[3.5px] mt-1 md:mt-2 "}`}
                  >
                    {todo.checked ? (
                      <Check
                        size={30}
                        className={`${list.theme.textColor} flex justify-center items-center w-[35px] h-[35px]`}
                      />
                    ) : (
                      <div className="w-[35px] h-[35px]" />
                    )}
                  </div>
                  <h3
                    className={`${
                      list.theme.textColor
                    } w-[90%] lg:w-full inline-block relative ${
                      todo.checked ? "line-through " : ""
                    }`}
                  >
                    {todo.input}
                  </h3>
                </div>
                <div className="flex gap-2 lg:gap-3">
                  <Pen
                    size={25}
                    className={`${list.theme.textColor}`}
                    onClick={() => onUpdate(todo)}
                  />
                  <Trash2
                    size={25}
                    className={`${list.theme.textColor} cursor-pointer`}
                    onClick={() => onDeleteHandler(todo.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
