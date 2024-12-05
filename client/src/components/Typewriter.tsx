import { useState, useEffect } from "react";

const Typewriter = ({ text, typingSpeed = 50 }:{text:string,typingSpeed:number}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length-1) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [text, typingSpeed]);

  return <p className="typewriter">{displayedText}</p>;
};

export default Typewriter;
