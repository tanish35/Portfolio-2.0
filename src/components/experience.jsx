"use client";

import React, { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const experienceData = [
  {
    title: "",
    company: "",
    companyUrl: "",
    duration: "",
    description: "",
  },
];

const Experience = forwardRef(({ visible }, ref) => {
  console.info("Experience component loaded", visible, ref);
  return (
    <section
      ref={ref}
      id="experience"
      className="relative bg-grid-white/[0.2] flex items-center justify-center"
    >
      <div className="custom-shadow-50 rounded-[24px] max-w-[1200px]">
        <div className="flex items-center custom-shadow-b border-secondary-300 border-1 justify-center gap-x-2 py-3 bg-secondary-100 rounded-t-[24px]">
          <svg
            width="30"
            height="30"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.07625 3.98801C3.98999 4.60257 2.53078 6.49763 2.50048 8.6803C2.5 8.71453 2.5 8.75303 2.5 8.83004V10.766C2.58497 10.7659 2.67133 10.7832 2.75399 10.8196C7.36721 12.8561 12.6331 12.8561 17.2463 10.8196C17.3289 10.7832 17.4151 10.766 17.5 10.766V8.83004C17.5 8.75303 17.5 8.71453 17.4995 8.6803C17.4692 6.49764 16.01 4.6026 13.9238 3.98802C13.6924 3.91217 12.991 3.77658 12.6693 3.71826C10.9026 3.41813 9.09741 3.41813 7.33074 3.71825C6.99355 3.78207 6.27059 3.92537 6.07625 3.98801ZM8.33333 9.93827C7.98816 9.93827 7.70833 10.2162 7.70833 10.5591C7.70833 10.9019 7.98816 11.1798 8.33333 11.1798H11.6667C12.0118 11.1798 12.2917 10.9019 12.2917 10.5591C12.2917 10.2162 12.0118 9.93827 11.6667 9.93827H8.33333Z"
              fill="#E94B30"
            />
            <path
              opacity="0.5"
              d="M7.3946 3.32613C7.64939 2.59675 8.34741 2.07458 9.16661 2.07458H10.8333C11.6525 2.07458 12.3505 2.59675 12.6053 3.32613C12.6432 3.43457 12.6616 3.55972 12.6692 3.71787C12.9909 3.77619 13.6923 3.91178 13.9237 3.98763V3.93678C13.9237 3.65468 13.9141 3.28519 13.7862 2.91914C13.3623 1.70563 12.2012 0.833008 10.8333 0.833008H9.16661C7.79869 0.833008 6.63758 1.70562 6.21367 2.91914C6.08579 3.28519 6.07617 3.65468 6.07617 3.93678V3.98762C6.27051 3.92498 6.99347 3.78168 7.33066 3.71786C7.33827 3.55971 7.35672 3.43457 7.3946 3.32613Z"
              fill="#E94B30"
            />
            <path
              opacity="0.5"
              d="M17.5 12.0636C16.75 12.3819 15.9845 12.6503 15.2085 12.8689V13.8695C15.2085 14.2124 14.9287 14.4903 14.5835 14.4903C14.2383 14.4903 13.9585 14.2124 13.9585 13.8695V13.1761C10.1438 13.9791 6.14023 13.6082 2.5 12.0635V13.3521C2.5 15.1052 3.72584 16.623 5.44877 17.0033C8.44636 17.6649 11.5536 17.6649 14.5512 17.0033C16.2742 16.623 17.5 15.1052 17.5 13.3521V12.0636Z"
              fill="#E94B30"
            />
          </svg>
          <div>Work Timeline</div>
        </div>
        <div className="custom-shadow-t min-h-60 border-secondary-300 border-1 bg-secondary-100 rounded-b-[24px] relative px-5 py-2 overflow-y-scroll space-y-6">
          <div className="flex absolute justify-end inset-0">
            <div className="relative">
              <div className="journey-line absolute overflow-hidden z-0 top-0 bottom-0"></div>
            </div>
            <div className="overflow-hidden relative w-[50%]"></div>
          </div>
          {visible &&
            experienceData.map((exp, index) => (
              <AnimatePresence mode="wait" key={index}>
                <div className="journey-stop grid grid-cols-5 items-center justify-center">
                  <motion.div
                    id={`exp-left-${index}`}
                    initial={{
                      opacity: 0,
                      x: -100,
                    }}
                    animate={{
                      x: 0,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 1 * index,
                    }}
                    className="bg-secondary-300 rounded-xl custom-shadow-200 col-span-2"
                  >
                    <div className="font-semibold text-teritiary-600 custom-shadow-b px-6 py-3">
                      {exp.title}
                      <div className="text-xs text-teritiary-400 truncate">
                        {exp.duration}
                      </div>
                    </div>
                    <div className="text-sm text-teritiary-300 font-gotham-book custom-shadow-t px-6 py-3 max-sm:hidden">
                      {exp.description}
                    </div>
                  </motion.div>
                  <motion.div
                    id={`exp-center-${index}`}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      duration: 1 * index,
                    }}
                    className="col-span-1"
                  >
                    <div className="flex justify-center items-center">
                      <div className="bg-secondary-700 p-2 rounded-full">
                        <div className="size-4 bg-teritiary-800 rounded-full relative shadow-lg shadow-orange-400 drop-shadow-lg"></div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    id={`exp-right-${index}`}
                    initial={{
                      opacity: 0,
                      x: 100,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 1 * index,
                    }}
                    className="bg-secondary-300 py-3 px-6 rounded-xl custom-shadow-200 col-span-2"
                  >
                    <div className="text-lg font-semibold text-teritiary-600 max-sm:text-base">
                      {exp.company}
                    </div>
                    <div className="text-sm text-teritiary-300 font-gotham-book max-sm:tex-txs max-sm:truncate">
                      {exp.companyUrl}
                    </div>
                  </motion.div>
                </div>
              </AnimatePresence>
            ))}
        </div>
      </div>
    </section>
  );
});

export default Experience;
