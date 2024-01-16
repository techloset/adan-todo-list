"use client";

import { useCallback, useState } from "react";

import Image from "next/image";
import toast from "react-hot-toast";
import { auth, db } from "@/config/database";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

type Variant = "LOGIN" | "REGISTER";

export default function Home() {
  const [variant, setVariant] = useState<Variant>("LOGIN");

  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [user, loading] = useAuthState(auth);

  const toggleVariant = useCallback(() => {
    if (variant == "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (variant == "LOGIN") {
      if (email && password) {
        setIsLoading(true);
        try {
          await signInWithEmailAndPassword(auth, email, password);
          toast.success("Successfully Login");
          router.push("/dashboard");
        } catch (error: any) {
          console.log("-----------------------");
          console.log(error);
          console.log("-----------------------");
          if (error.code === "auth/invalid-credential") {
            toast.error("The email or password is wrong");
          } else {
            toast.error("Something went wrong, please try again");
          }
          setIsLoading(false);
        }
      } else {
        toast.error("Please fill all the fields");
      }
    }
    if (variant == "REGISTER") {
      if (username && email && password) {
        setIsLoading(true);
        try {
          const res = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          await updateProfile(res.user, {
            displayName: username,
          });
          const userAdding = {
            name: username,
            email: email,
            uid: res.user.uid,
          };
          await addDoc(collection(db, "users"), userAdding);
          await signInWithEmailAndPassword(auth, email, password);
          toast.success("Successfully Registered");
          router.push("/dashboard");
        } catch (error: any) {
          console.log("-----------------------");
          console.log(error);
          console.log("-----------------------");
          if (error.code === "auth/email-already-in-use") {
            toast.error("This email is already registered");
          } else {
            toast.error("Something went wrong, please try again");
          }
          setIsLoading(false);
        }
      } else {
        toast.error("Please fill all the fields");
      }
    }
  };
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  if (user?.email) {
    return router.push("/dashboard");
  }
  if (!user?.email) {
    return (
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 lg:h-screen h-auto font-thin">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-white ">
            Sign in to your account
          </h1>
        </div>
        <div className=" mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
          <div className=" bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6 " onSubmit={onHandleSubmit}>
              {variant == "REGISTER" && (
                <div>
                  <label
                    className="block text-sm font-bold leading-5 text-gray-900"
                    htmlFor="Username"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      id="Username"
                      type="text"
                      placeholder="Enter your Username.."
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      disabled={isLoading}
                      className={`block w-full rounded-md border-0 py-1.5 dark:placeholder:text-black text-black text-medium shadow-sm ring-1 ring-inset placeholder:text-opacity-25 focus:ring-2  focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 px-2 bg-blue-100 ${
                        isLoading && "opacity-50 cursor-default"
                      }`}
                    />
                  </div>
                </div>
              )}
              <div>
                <label
                  className="block text-sm font-bold leading-5 text-gray-900"
                  htmlFor="Email"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your Email.."
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    disabled={isLoading}
                    className={`block w-full rounded-md border-0 py-1.5 dark:placeholder:text-black text-black text-medium shadow-sm ring-1 ring-inset placeholder:text-opacity-25 focus:ring-2  focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 px-2 bg-blue-100 ${
                      isLoading && "opacity-50 cursor-default"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-bold leading-5 text-gray-900"
                  htmlFor="Password"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password.."
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    disabled={isLoading}
                    className={`block w-full rounded-md border-0 py-1.5 dark:placeholder:text-black text-black text-medium shadow-sm ring-1 ring-inset placeholder:text-opacity-25 focus:ring-2  focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 px-2 bg-blue-100 ${
                      isLoading && "opacity-50 cursor-default"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`flex hover:cursor-pointer justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full bg-blue-300 text-slate-950 ${
                  isLoading && "opacity-50 cursor-default"
                }`}
              >
                Submit
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t  border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className=" px-2  bg-white  text-gray-500">
                    Or contine with
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-center text-center text-sm mt-6 px-2  text-gray-500">
              <div>
                {variant == "LOGIN"
                  ? "New to Messenger?"
                  : "Already have an account?"}
              </div>
              <div onClick={toggleVariant} className="underline cursor-pointer">
                {variant == "LOGIN" ? "Create an account" : "Login"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
