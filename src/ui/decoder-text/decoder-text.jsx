import { VisuallyHidden } from "@/ui/visually-hidden";
import { useReducedMotion, useSpring } from "framer-motion";
import { memo, useEffect, useRef } from "react";
import { delay } from "@/utils/delay";
import { classes } from "@/utils/style";
import styles from "./decoder-text.module.css";

// Specific Hindi characters for "Tanish Majumdar" (तनिष माजुमदार)
const glyphs = [
  "त",
  "न",
  "ि",
  "ष",
  " ",
  "म",
  "ा",
  "ज",
  "ु",
  "म",
  "द",
  "ा",
  "र",
];

const CharType = {
  Glyph: "glyph",
  Value: "value",
};

function shuffle(content, output, position) {
  return content.map((value, index) => {
    if (index < position) {
      return { type: CharType.Value, value };
    }

    const currentIndex = index % glyphs.length;
    return { type: CharType.Glyph, value: glyphs[currentIndex] };
  });
}

export const DecoderText = memo(
  ({ text, start = true, delay: startDelay = 0, className, ...rest }) => {
    const output = useRef([{ type: CharType.Glyph, value: "" }]);
    const container = useRef();
    const reduceMotion = useReducedMotion();
    const decoderSpring = useSpring(0, { stiffness: 8, damping: 5 });

    useEffect(() => {
      const containerInstance = container.current;
      const content = text.split("");
      let animation;

      const renderOutput = () => {
        const characterMap = output.current.map((item) => {
          return `<span class="${styles[item.type]}">${item.value}</span>`;
        });

        containerInstance.innerHTML = characterMap.join("");
      };

      const unsubscribeSpring = decoderSpring.on("change", (value) => {
        output.current = shuffle(content, output.current, value);
        renderOutput();
      });

      const startSpring = async () => {
        await delay(startDelay);
        decoderSpring.set(content.length);
      };

      if (start && !animation && !reduceMotion) {
        startSpring();
      }

      if (reduceMotion) {
        output.current = content.map((value, index) => ({
          type: CharType.Value,
          value: content[index],
        }));
        renderOutput();
      }

      return () => {
        unsubscribeSpring?.();
      };
    }, [decoderSpring, reduceMotion, start, startDelay, text]);

    return (
      <span className={classes(className)} {...rest}>
        <VisuallyHidden>{text}</VisuallyHidden>
        <span aria-hidden ref={container} />
      </span>
    );
  }
);
