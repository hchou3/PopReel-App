"use client";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { LearnMore } from "./components/learn-more";
import signIn from "./images/sign-in@2xrl.webp";
import verify from "./images/verify@2xrl.webp";
import userButton2 from "./images/user-button-2@2xrl.webp";
import signUp from "./images/sign-up@2xrl.webp";
import logo from "./images/logo.png";
import { ClerkProvider } from "@clerk/clerk-react";
import "./home.css";
import Image from "next/image";
import Link from "next/link";
import { ClerkLogo } from "./components/clerk-logo";
import { NextLogo } from "./components/next-logo";
import React from "react";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function Home() {
  return (
    <>
      <main className="bg-[#FAFAFA] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
        </div>
        <div className="w-full bg-white max-w-[75rem] mx-auto flex flex-col border-l border-r border-[#F2F2F2] row-span-3">
          <Image
            alt="Device"
            className="size-64 bg-transparent absolute left-1/2 -translate-x-[23.75rem] -top-6 h-[51.375rem] object-contain w-[39.0625rem]"
            src={logo}
            unoptimized
          />
        </div>
      </main>
    </>
  );
}
