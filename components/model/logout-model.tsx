"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/config/database";

import Image from "next/image";

interface LogoutModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModel: React.FC<LogoutModelProps> = ({ isOpen, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isOpen) {
    return null;
  }

  const Logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      router.push("/");
      onClose();
    } catch (error) {
      console.log("error", error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%]  top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg bg-white">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <div className="flex flex-row justify-between items-center">
            <div className="text-lg font-semibold leading-none tracking-tight">
              Are you sure you want to Logout
            </div>
            <div
              onClick={onClose}
              className="p-[3px] cursor-pointer flex justify-center items-center border-2 border-black  rounded-md  "
            >
              <Image
                src="/cross.svg"
                alt="Cross"
                height={20}
                width={20}
                className="h-4 w-4 "
              />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Please come again anytime. 😢👋
          </div>
        </div>
        <div className="pt-6 space-x-2 flex items-center justify-between w-full">
          <button
            disabled={loading}
            className="rounded-lg border-2 py-2 px-3 border-stone-300 hover:border-black hover:bg-stone-200 dark:hover:bg-exact-purple dark:border-white  opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={onClose}
          >
            Close
          </button>
          <button
            disabled={loading}
            className="  py-2 px-3 text-white rounded-lg bg-red-500  ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={Logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModel;
