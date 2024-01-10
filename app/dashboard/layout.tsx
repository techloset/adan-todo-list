"use client";

import { auth } from "@/config/database";
import { useAuthState } from "react-firebase-hooks/auth";

import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Header from "@/components/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);

  const router = useRouter();
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  if (!user?.email) {
    return router.push("/");
  }

  if (user?.email) {
    return (
      <>
        {/* <Header /> */}
        {children}
      </>
    );
  }
}
