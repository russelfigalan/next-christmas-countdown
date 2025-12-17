"use client";

import { useState, useRef } from "react";

const Header = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggle = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  return (
    <>
      <header className="h-[5rem] p-[1rem] fixed right-0 flex justify-end-safe z-20 cursor-pointer">
        <audio ref={audioRef} src="/music/auld-lang-syne.mp3" loop />
        <div onClick={toggle}>
          <img
            src={isPlaying ? "/icon/sound-on.png" : "/icon/sound-off.png"}
            alt=""
            className="w-[30px] h-[30px] cursor-pointer"
          />
        </div>
      </header>
    </>
  );
};

export default Header;
