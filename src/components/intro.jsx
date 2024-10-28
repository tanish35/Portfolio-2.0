"use client";

import { forwardRef, useState } from "react";
import { DecoderText } from "@/ui/decoder-text";
import {
  IconMapPin,
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandInstagram,
} from "@tabler/icons-react";
import { RiScrollToBottomLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Highlight } from "@/ui/aceternity/hero-highlight";
import { PlaceholdersAndVanishInput } from "@/ui/aceternity/placeholders-and-vanish-input";
import Image from "next/image";

const Intro = forwardRef(({ scrollIndicatorHidden }, ref) => {
  const [email, setEmail] = useState("");
  const validateEmail = (email) => {
    return email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  };
  // const subscribe = async (email) => {
  //   try {
  //     const res = await fetch("/api/subscribe", {
  //       method: "POST",
  //       body: JSON.stringify({ email }),
  //     });
  //     if (res.ok) toast.success("Subscribed to newsletter!");
  //     else toast.error("Failed to subscribe!");
  //   } catch (err) {
  //     toast.error("Failed to subscribe!");
  //   }
  // };
  return (
    <AnimatePresence mode="wait">
      <motion.section
        ref={ref}
        id="about"
        initial={{
          opacity: 0,
          x: -100,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="md:text-4xl text-2xl bg-dot-white/[0.2] relative font-bold flex items-center text-teritiary-300 justify-center"
      >
        <div className="space-y-4">
          <div className="flex gap-x-4 font-gotham-bold">
            <Image
              src="/svgs/logo.svg"
              width={150}
              height={175}
              alt="Me"
              className="p-2 bg-secondary-200 rounded-xl custom-shadow-200"
            />
            <div className="self-end space-y-1 cursor-pointer p-2 h-full w-full">
              <DecoderText text="Tanish Majumdar" delay={500} />
              <div className="font-sans text-base flex gap-x-1 items-center">
                <IconMapPin className="size-4" />
                <DecoderText text="Delhi" delay={500} />
              </div>
              <div className="font-sans text-base flex gap-x-2 items-center text-teritiary-400">
                <a
                  href="https://www.linkedin.com/in/tanish34/"
                  target="_blank"
                  aria-label="LinkedIn"
                  rel="noreferrer"
                >
                  <IconBrandLinkedin className="size-4 hover:text-teritiary-700 cursor-pointer" />
                </a>
                <a
                  href="https://github.com/tanish35"
                  target="_blank"
                  aria-label="GitHub"
                  rel="noreferrer"
                >
                  <IconBrandGithub className="size-4 hover:text-teritiary-700 cursor-pointer" />
                </a>
                <a
                  href="https://www.instagram.com/tanishm._.29/"
                  target="_blank"
                  aria-label="GitHub"
                  rel="noreferrer"
                >
                  <IconBrandInstagram className="size-4 hover:text-teritiary-700 cursor-pointer" />
                </a>
              </div>
              <div className="!mt-4 flex max-w-sm">
                {/* <PlaceholdersAndVanishInput
                  placeholders={["Join my newsletter..."]}
                  onChange={(e) => setEmail(e.target.value)}
                  id="newsletter-form"
                  // onSubmit={async () => {
                  //   if (!validateEmail(email)) {
                  //     toast.error("Invalid email address!");
                  //     return;
                  //   }
                  //   subscribe(email);
                  // }}
                /> */}
              </div>
            </div>
          </div>
          <div className="text-teritiary-800 text-5xl font-gotham-book max-sm:hidden">
            Building software <br className="md:hidden" />
            <Highlight className="text-black dark:text-white">
              one line at a time
            </Highlight>
          </div>
        </div>
        {!scrollIndicatorHidden && (
          <button
            aria-label="scroll-indicator"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              });
            }}
            className="absolute bottom-10 left-[50%] hidden md:block"
          >
            <RiScrollToBottomLine className="animate-pulse opacity-30 text-teritiary-400 size-8" />
          </button>
        )}
      </motion.section>
    </AnimatePresence>
  );
});

export default Intro;
