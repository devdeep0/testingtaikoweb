import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Suspense } from 'react';
import { AutoConnect } from "thirdweb/react";
import Image from "next/image";
import { useActiveAccount } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";
import { client, wallet } from "@/app/constant";
import { main } from 'framer-motion/client';




function Header() {

  return (
    <main className='bg-black'>
    <div className="flex justify-center p-4 py-8 bg-black gap-5 items-center border-b-2  w-[80%] mx-auto">
       <div className="flex items-center gap-2">
              <Image
              src='/logos/RL.png'
              alt=''
              height={23}
              width={33}
              />
            </div>
            <div className="flex items-center gap-2">
              <Image
              src='/logos/OP.png'
              alt=''
              height={60}
              width={60}
              />
            </div>
            <div className="text-[#FF0000] text-xs flex flex-col items-end gap-2">
            <Image
              src='/logos/thirdweeb.png'
              alt=''
              height={20}
              width={33}
              />
            </div>
          </div>
          </main>
)
}

export default Header