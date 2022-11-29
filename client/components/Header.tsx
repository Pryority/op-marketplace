import React from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
// import { Faucet } from "~~/components/scaffold-eth";

export default function Header() {
  return (
    <footer className="flex flex-col md:py-8 pb-8 items-center w-full">
      <div className="flex flex-row items-center justify-around w-full">
        <Link href="/">
          Home
        </Link>
        <Link href="/create-and-list-nft">
          Sell a new NFT
        </Link>
        <Link href="/my-nfts">
          My NFTs
        </Link>
        <Link href="/my-listed-nfts">
          My Listed NFTs
        </Link>

        <ConnectButton
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
          showBalance={true}
          chainStatus={{
            smallScreen: "icon",
            largeScreen: "full",
          }}
        />
      </div>
      {/* <Faucet /> */}
    </footer>
  );
}
