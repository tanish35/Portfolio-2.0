import { useReducedMotion } from "framer-motion";
import { useCallback, useRef } from "react";

export function useScrollToHash() {
  const scrollTimeout = useRef();
  const reduceMotion = useReducedMotion();

  const scrollToHash = useCallback(
    (hash) => {
      const id = hash.split("#")[1];
      const targetElement = document.getElementById(id);

      targetElement.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
      });

      const handleScroll = () => {
        clearTimeout(scrollTimeout.current);

        scrollTimeout.current = setTimeout(() => {
          window.removeEventListener("scroll", handleScroll);
        }, 50);
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        clearTimeout(scrollTimeout.current);
      };
    },
    [reduceMotion]
  );

  return scrollToHash;
}
