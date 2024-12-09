"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import  { Suspense } from 'react';
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { AutoConnect } from "thirdweb/react";

import { useActiveAccount } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";
import { client, wallet } from "@/app/constant";

import Link from "next/link";
import { BarChart3, Home, Menu } from 'lucide-react'
interface GameSelectionUIProps {
  isLoading: boolean;
  selectedGame: string;
  onGameSelect: (game: string) => void;


}


const gamePreviewData = [
  { id: 1, src: "/images/image DISPALY.png", alt: "Game Preview 1" },
  { id: 2, src: "/images/TrailblazerIMG.png", alt: "Game Preview 2" },
  { id: 3, src: "/images/image DISPALY.png", alt: "Game Preview 3" },
]



const GameSelectionUI : React.FC<GameSelectionUIProps> = ({ isLoading, selectedGame, onGameSelect }) => {
  const account = useActiveAccount();
  const [activeButton, setActiveButton] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % gamePreviewData.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])
  return (
    <div className="h-screen bg-black text-white bg-[url('/bg/BG.png')] bg-cover bg-center">
    <div className="mx-auto max-w-md bg-transparent p-6 pb-20">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mb-1 flex justify-center">
        </div>
        <div className="flex items-center justify-center gap-1">
          <div className="h-[1px] w-12 bg-pink-500/50" />
          <Image
            src="/logo/taiko-v-blk 1.png"
            alt="Taiko Logo"
            width={80}
            height={80}
            className="mb-1"
          />
          <div className="h-[1px] w-12 bg-pink-500/50" />
          
    
        </div>
        <div className="text-sm font-semibold tracking-widest text-pink-500 mt-3">GAMES</div>
      </div>

      {/* Game Preview Card */}
      <div className="relative mb-4 overflow-hidden rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-transparent">
          <div className="aspect-[4/3] w-full bg-black">
            {gamePreviewData.map((preview, index) => (
              <Image
                key={preview.id}
                src={preview.src}
                alt={preview.alt}
                width={400}
                height={300}
                className={`absolute h-full w-full object-cover transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Dot Navigation */}
        <div className="mb-6 flex justify-center gap-1">
          {gamePreviewData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 w-1 rounded-full ${
                index === currentSlide ? 'bg-pink-500' : 'bg-pink-500/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      {/* Game List */}
      <div className="mb-6 space-y-3">
        <div className="text-sm font-light tracking-[0.5em]">LIST</div>
        
        {/* Atlas Game */}
        <div className="flex items-center justify-between rounded-xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-transparent p-3">
          <div className="flex items-center gap-3">
            <Image
              src="/gameimg/atlas.png"
              alt="Atlas"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-medium  tracking-wide font-pop text-[14px]">ATLAS</span>
          </div>
          <button className="h-8 border-l border-pink-500/20 px-4 text-xs font-medium tracking-wider text-pink-500"
          onClick={() => onGameSelect("unity2")}
          disabled={isLoading}>
            PLAY
          </button>
        </div>

        {/* Trailblazer Game */}
        <div className="flex items-center justify-between rounded-xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-transparent p-3">
          <div className="flex items-center gap-3">
            <Image
              src="/gameimg/trailblazer.png"
              alt="Trailblazer"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-medium tracking-wide font-pop text-[14px]">TRAILBLAZER</span>
          </div>
          <button className="h-8 border-l border-pink-500/20 px-4 text-xs font-medium tracking-wider text-pink-500"
          onClick={() => onGameSelect("unity3")}
          disabled={isLoading}>
            PLAY
          </button>
        </div>

 {/* Taiko Block Puzzle */}
 <div className="flex items-center justify-between rounded-xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-transparent p-3">
          <div className="flex items-center gap-3">
            <Image
              src="/gameimg/TaikoBlockPuzzle.png"
              alt="TaikoBlockPuzzle"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-medium tracking-wide font-pop text-[14px]">Taiko Block Puzzle</span>
          </div>
          <button className="h-8 border-l border-pink-500/20 px-4 text-xs font-medium tracking-wider text-pink-500"
          onClick={() => onGameSelect("unity4")}
          disabled={isLoading}>
            PLAY
          </button>
        </div>
       
      </div>

      

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-around border-t-3 border-pink-500/20 bg-[#0C101B] px-6 py-5 backdrop-blur">
        <BarChart3 className="h-6 w-6 text-pink-500/50" />
        <Home className="h-6 w-6 text-pink-500" />
        <Menu className="h-6 w-6 text-pink-500/50" />
      </div>
    </div>
  </div>
  );
};

export default GameSelectionUI;




{/* <button onClick={() => onGameSelect("unity3")}
              disabled={isLoading}
               className='bg-[#FF0420] mt-2 w-[305px] text-center font-zk text-[30px] flex items-center justify-center font-bold rounded-[10px] text-white'>PLAY</button> */}

 {/* <div className="flex flex-col items-center justify-center h-full ">
      <div className="p-8 bg-transparent rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center">Telegram Login Successful</h1>
        <p className="mb-6 text-center">Choose a game to continue:</p>
        <div className="space-y-4">
          <button 
            onClick={() => onGameSelect("unity")}
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading && selectedGame === "unity" ? "Redirecting..." : "Base Game"}
          </button>
          <button 
            onClick={() => onGameSelect("unity2")}
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading && selectedGame === "unity2" ? "Redirecting..." : "Continue to Unity Game 2"}
          </button>
        </div>
      </div>
    </div> */}
