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
      <div className="lg:px-8 d lg:h-screen h-auto px-4 grid lg:grid-cols-2 md:grid-cols-1 justify-center items-center gap-3 bg-rose-200">
        <div className="md:w-[445px] w-[370px]  flex flex-col gap-6 mx-auto my-10">
          <h1 className=" lg:text-5xl text-3xl font-bold text-purple-400">
            Welcome
          </h1>
          {variant == "LOGIN" ? (
            <p className="text-md text-black font-medium italic">
              Hi, Welcome back 👋{" "}
            </p>
          ) : (
            <p className="text-md text-black font-medium italic">
              Join our Todo app👋{" "}
            </p>
          )}

          <div className="grid grid-cols-2 justify-center items-center ">
            <div
              className={`items-center hover:cursor-pointer justify-center flex font-semibold text-xl h-10  ${
                variant == "LOGIN"
                  ? "border-b-purple-700 "
                  : "border-b-gray-400"
              } border-b-4 rounded-sm `}
              onClick={toggleVariant}
            >
              <p>Login</p>
            </div>
            <div
              className={`items-center hover:cursor-pointer  ${
                variant == "REGISTER"
                  ? "border-b-purple-700 "
                  : "border-b-gray-400"
              } justify-center flex font-semibold text-xl h-10   border-b-4 rounded-sm `}
              onClick={toggleVariant}
            >
              <p>Sign Up</p>
            </div>
          </div>
          <form className="space-y-6" onSubmit={onHandleSubmit}>
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
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 text-medium shadow-sm ring-1 ring-inset dark:ring-purple-300 dark:placeholder:text-black placeholder:text-opacity-25 focus:ring-2  focus:ring-inset focus:ring-purple-300 sm:text-sm sm:leading-6 px-2 bg-red-300/80 ${
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
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 text-medium shadow-sm ring-1 ring-inset dark:ring-purple-300 dark:placeholder:text-black placeholder:text-opacity-25 focus:ring-2  focus:ring-inset focus:ring-purple-300 sm:text-sm sm:leading-6 px-2 bg-red-300/80 ${
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
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 text-medium shadow-sm ring-1 ring-inset dark:ring-purple-300 dark:placeholder:text-black placeholder:text-opacity-25 focus:ring-2  focus:ring-inset focus:ring-purple-300 sm:text-sm sm:leading-6 px-2 bg-red-300/80 ${
                    isLoading && "opacity-50 cursor-default"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`flex hover:cursor-pointer justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full bg-purple-400 ${
                isLoading && "opacity-50 cursor-default"
              }`}
            >
              Submit
            </button>
          </form>
        </div>
        <Image
          src="/auth-image.svg"
          alt="auth"
          height={1000}
          width={1000}
          className="hidden lg:flex"
        />
      </div>
    );
  }
}
