"use client";

import { forwardRef } from "react";
import { DecoderText } from "@/ui/decoder-text";
import {
  IconMapPin,
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandInstagram,
} from "@tabler/icons-react";
import { RiScrollToBottomLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight } from "@/ui/aceternity/hero-highlight";
import Image from "next/image";
import { LinkPreview } from "@/ui/aceternity/link-preview";

const Intro = forwardRef(({ scrollIndicatorHidden }, ref) => {
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
        className="md:text-4xl text-2xl bg-dot-white/[0.2] relative font-bold flex items-center text-teritiary-300 justify-center md:justify-start md:pl-[8%] lg:pl-[12%]"
      >
        <div className="space-y-4">
          <div className="flex gap-x-4 font-gotham-bold">
            <Image
              src="/svgs/logo.webp"
              width={150}
              height={150}
              alt="Me"
              priority
              fetchPriority="high"
              sizes="150px"
              className="p-2 bg-secondary-200 rounded-xl custom-shadow-200"
            />
            <div className="self-end space-y-1 cursor-pointer p-2 h-full w-full">
              <DecoderText text="Tanish Majumdar" delay={500} />
              <div className="font-sans text-base flex gap-x-1 items-center">
                <IconMapPin className="size-4" />
                <DecoderText text="Mumbai" delay={500} />
              </div>
              <div className="flex gap-x-2 items-center text-teritiary-400 text-base font-sans">
                <LinkPreview
                  url="https://www.linkedin.com/in/tanish34/"
                  className="font-bold"
                  isStatic={true}
                  imageSrc="/images/linkedin.webp"
                >
                  <IconBrandLinkedin className="size-4 hover:text-teritiary-700 cursor-pointer" />
                </LinkPreview>
                <LinkPreview
                  url="https://github.com/tanish35"
                  className="font-bold"
                  isStatic={true}
                  imageSrc="/images/git.webp"
                >
                  <IconBrandGithub className="size-4 hover:text-teritiary-700 cursor-pointer" />
                </LinkPreview>
                <LinkPreview
                  url="https://www.instagram.com/tanishm._.29/"
                  className="font-bold"
                  isStatic={true}
                  imageSrc="/images/insta.webp"
                >
                  <IconBrandInstagram className="size-4 hover:text-teritiary-700 cursor-pointer" />
                </LinkPreview>
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
            type="button"
            aria-label="Scroll to next section"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              });
            }}
            className="absolute bottom-10 left-[50%] -translate-x-1/2 hidden md:block"
          >
            <RiScrollToBottomLine className="animate-pulse opacity-30 text-teritiary-400 size-8" />
          </button>
        )}
      </motion.section>
    </AnimatePresence>
  );
});

Intro.displayName = "Intro";

export default Intro;
