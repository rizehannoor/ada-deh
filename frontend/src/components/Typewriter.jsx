import { useEffect, useRef, useState } from "react";

function getCharacterDelay(text, index, baseSpeed, climax) {
  const progress = index / Math.max(text.length, 1);

  let delay = baseSpeed;

  const variation = Math.random() * 18 - 9;
  delay += variation;

  if (climax) {
    delay += 8;
  }

  const previous = text[index - 1];

  if (previous === "." || previous === "!" || previous === "?") {
    delay += 120;
  }

  if (previous === ",") {
    delay += 45;
  }

  if (progress > 0.92) {
    delay += 5;
  }

  return Math.max(18, delay);
}

export default function Typewriter({
  lines = [],
  onComplete,
  climaxIndex = -1,
  className = "",
}) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [finished, setFinished] = useState(false);

  const completeCalled = useRef(false);
  const lineTimeout = useRef(null);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    return () => {
      if (lineTimeout.current) {
        clearTimeout(lineTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!lines.length || finished) return;

    if (currentLine >= lines.length) {
      if (!completeCalled.current) {
        completeCalled.current = true;
        setFinished(true);
        onComplete?.();
      }

      return;
    }

    const line = lines[currentLine];

    if (reducedMotion) {
      setVisibleLines((previous) => {
        if (
          previous.some(
            (item) => item.index === currentLine
          )
        ) {
          return previous;
        }

        return [
          ...previous,
          {
            index: currentLine,
            text: line,
            climax: currentLine === climaxIndex,
          },
        ];
      });

      setCurrentLine((value) => value + 1);

      return;
    }

    if (currentText.length < line.length) {
      const delay = getCharacterDelay(
        line,
        currentText.length,
        line.length > 70 ? 28 : 42,
        currentLine === climaxIndex
      );

      lineTimeout.current = setTimeout(() => {
        setCurrentText((previous) => {
          if (previous.length >= line.length) {
            return previous;
          }

          return line.slice(0, previous.length + 1);
        });
      }, delay);

      return () => {
        if (lineTimeout.current) {
          clearTimeout(lineTimeout.current);
        }
      };
    }

    lineTimeout.current = setTimeout(() => {
      setVisibleLines((previous) => {
        if (
          previous.some(
            (item) => item.index === currentLine
          )
        ) {
          return previous;
        }

        return [
          ...previous,
          {
            index: currentLine,
            text: line,
            climax: currentLine === climaxIndex,
          },
        ];
      });

      setCurrentText("");
      setCurrentLine((value) => value + 1);
    }, currentLine === lines.length - 1 ? 650 : 420);

    return () => {
      if (lineTimeout.current) {
        clearTimeout(lineTimeout.current);
      }
    };
  }, [
    lines,
    currentLine,
    currentText,
    reducedMotion,
    climaxIndex,
    finished,
    onComplete,
  ]);

  return (
    <div className={`typewriter ${className}`}>
      {visibleLines.map((line) => (
        <div
          className={`type-line completed ${
            line.climax ? "type-line-climax" : ""
          }`}
          key={line.index}
        >
          {line.text}
        </div>
      ))}

      {!finished &&
        currentLine < lines.length &&
        currentText.length > 0 && (
          <div
            className={`type-line active ${
              currentLine === climaxIndex
                ? "type-line-climax"
                : ""
            }`}
          >
            {currentText}
            <span className="typing-cursor" />
          </div>
        )}
    </div>
  );
}