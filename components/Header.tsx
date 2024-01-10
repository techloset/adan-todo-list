"use client";

import LogoutModel from "@/components/model/logout-model";
import { auth } from "@/config/database";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && <LogoutModel isOpen={open} onClose={() => setOpen(false)} />}
      <div className="w-full h-20 shadow-md bg-white rounded-lg  px-3 lg:px-8 flex   justify-between items-center">
        <h1 className="text-black font-semibold text-xl">
          Hello! {user?.displayName}
        </h1>
        <button
          className={`text-base md:max-w-fit leading-[26px] font-semibold md:shadow-[-5px_10px_30px_rgba(253,71,144,0.5)] py-[19px] px-[35px] bg-rose-500 rounded-xl text-white`}
        >
          <p onClick={() => setOpen(true)}>Log out</p>
        </button>
      </div>
    </>
  );
};

export default Header;
