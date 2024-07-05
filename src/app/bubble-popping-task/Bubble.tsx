"use client";
import { useEffect, useState } from "react";

interface BubbleProps {
  color: string;
  onClick: (
    ballCoordString: string,
    mouseCoordString: string,
    color: string
  ) => void;
  bubbleSize?: number;
}

const Bubble = ({
  color,
  onClick,
  bubbleSize = 100,
  
}: BubbleProps) => {
  const [screenWidth, setScreenWidth] = useState<number>(100);
  const [screenHeight, setScreenHeight] = useState<number>(100);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const x = Math.random() * (window.innerWidth - bubbleSize);
      const y = Math.random() * (window.innerHeight - bubbleSize);
      // console.log(checkValidX(x));
      setPosition({ x, y });
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    }
  }, []);

  // require to avoid overlapping
  // const checkValidX = (x: number) => {
  //   if (ballOverlappingCoord.length === 0) {
  //     return true;
  //   }
  //   return ballOverlappingCoord.every(
  //     (item: number) => x < item - bubbleSize / 2 || x > item + bubbleSize / 2
  //   );
  // };

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     let x;
  //     let iteration = 0;
  //     const maxIterations = 5;

  //     do {
  //       x = Math.random() * (window.innerWidth - bubbleSize);
  //       iteration++;
  //       console.log(
  //         { iteration, ballOverlappingCoord, x },
  //         checkValidX(x),
  //         !checkValidX(x) && iteration < maxIterations
  //       );
  //     } while (!checkValidX(x) && iteration < maxIterations);

  //     const y = Math.random() * (window.innerHeight - bubbleSize);

  //     setPosition({ x, y });
  //     setBallOverlappingCoord((prev: number[]) => [...prev, x]);

  //     setScreenWidth(window.innerWidth);
  //     setScreenHeight(window.innerHeight);
  //   }
  // }, []);

  const [speed] = useState(Math.random() * 4 + 2); // Random speed between 1 and 5

  const handleBallTouch = (event: React.MouseEvent<HTMLDivElement>) => {
    const relativeX = (position.x / screenWidth) * 100;
    const relativeY =
      ((screenHeight - position.y - bubbleSize) / screenHeight) * 100;
    const ballCoordString = `${relativeX.toFixed(2)}-${relativeY.toFixed(2)}`;

    const xPercent = (event.clientX / window.innerWidth) * 100;
    const yPercent =
      ((window.innerHeight - event.clientY) / window.innerHeight) * 100;
    const mouseCoordString = `${xPercent.toFixed(2)}-${yPercent.toFixed(2)}`;

    onClick(ballCoordString, mouseCoordString, color);
  };

  useEffect(() => {
    let increasing = true;

    const intervalId = setInterval(() => {
      setPosition((prevPosition) => {
        let newY = 0;
        if (increasing) {
          newY = prevPosition.y - speed;
          if (newY <= 0) {
            increasing = false;
            newY = prevPosition.y + speed;
          }
        } else {
          newY = prevPosition.y + speed;
          if (newY >= screenHeight - bubbleSize) {
            increasing = true;
            newY = prevPosition.y - speed;
          }
        }
        return { ...prevPosition, y: newY };
      });
    }, 50);

    return () => clearInterval(intervalId);
  }, [bubbleSize, screenHeight, speed]);

  const floatAnimation = `
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-300px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;


  return (
    <div
      className="cursor-pointer bubble absolute rounded-full block"
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        backgroundColor: color,
        width: `${bubbleSize}px`,
        height: `${bubbleSize}px`,
      }}
      onClick={handleBallTouch}
    ></div>
  );
};

export default Bubble;
