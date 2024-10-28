"use client";

import React, { forwardRef } from "react";

const ContactMe = forwardRef(({ visible }, ref) => {
  console.info("ContactMe component loaded", visible, ref);
  return (
    <section
      className="relative flex bg-dot-white/[0.2] items-center h-screen justify-center"
      id="contact"
      ref={ref}
    >
      <div className="custom-shadow-50 rounded-[24px] min-w-[70%] z-10">
        <div className="flex overflow-hidden bg-secondary-100 border-1 custom-shadow-b border-secondary-300 relative w-full rounded-t-[24px]">
          <img
            src="/svgs/contact-me-cover.svg"
            height="100%"
            width="100%"
            alt="contact me cover"
          />
          <img
            alt="contact me floater"
            src="/svgs/contact-me-floater.svg"
            className="absolute animate-bounce top-3/4 left-2/3"
          />
        </div>
        <div className="rounded-b-[24px] flex custom-shadow-100 w-full custom-shadow-t items-center gap-x-8 justify-evenly bg-secondary-100 border-1 border-secondary-300 sm:py-10 sm:px-16 px-2 py-4">
          <a
            href="mailto:tanishmajumdar2912@gmail.com"
            className="border-1 border-secondary-300 custom-shadow-100 flex items-center justify-center bg-secondary-300 sm:py-6 py-2 sm:w-full px-4 gap-x-2  rounded-xl text-lg text-teritiary-600"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.5"
                d="M14.4539 3H10.0539C5.90555 3 3.83137 3 2.54264 4.31802C1.25391 5.63604 1.25391 7.75736 1.25391 12C1.25391 16.2426 1.25391 18.364 2.54264 19.682C3.83137 21 5.90555 21 10.0539 21H14.4539C18.6023 21 20.6764 21 21.9652 19.682C23.2539 18.364 23.2539 16.2426 23.2539 12C23.2539 7.75736 23.2539 5.63604 21.9652 4.31802C20.6764 3 18.6023 3 14.4539 3Z"
                fill="#E94B30"
              />
              <path
                d="M19.3813 8.034C19.7313 7.74231 19.7786 7.22209 19.4869 6.87206C19.1952 6.52204 18.675 6.47474 18.325 6.76643L15.9502 8.74542C14.924 9.60063 14.2114 10.1925 13.6099 10.5794C13.0276 10.9539 12.6327 11.0796 12.2531 11.0796C11.8736 11.0796 11.4787 10.9539 10.8964 10.5794C10.2948 10.1925 9.58234 9.60063 8.55608 8.74542L6.1813 6.76643C5.83127 6.47474 5.31105 6.52204 5.01936 6.87206C4.72767 7.22209 4.77497 7.74231 5.12499 8.034L7.54114 10.0475C8.51613 10.86 9.30637 11.5185 10.0038 11.9671C10.7304 12.4344 11.438 12.7296 12.2531 12.7296C13.0683 12.7296 13.7759 12.4344 14.5025 11.9671C15.1999 11.5185 15.9902 10.86 16.9652 10.0474L19.3813 8.034Z"
                fill="#E94B30"
              />
            </svg>
            <span className="hidden sm:block">Email</span>
            <span className="sm:hidden">Email</span>
          </a>
        </div>
      </div>
    </section>
  );
});

export default ContactMe;
