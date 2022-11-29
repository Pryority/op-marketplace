import Head from "next/head";

import Web3 from "web3";
import Web3Modal from "web3modal";
import { useEffect, useState } from "react";
import axios from "axios";
import { getProvider } from "@wagmi/core";
import { useContract, useContractRead } from "wagmi";

import Marketplace from "../contracts/optimism-contracts/Marketplace.json";
import NFT from "../contracts/optimism-contracts/NFT.json";

import { MARKETPLACE_ADDRESS, NFT_ADDRESS } from "../../config";

export default function Home() {
  const provider = getProvider();
  const [nfts, setNfts] = useState<any[] | undefined>();
  const [tokenId, setTokenId] = useState(0);
  const [loadingState, setLoadingState] = useState("not-loaded");
  // Get all listed NFTs
  const { data: listedNfts, isError, isLoading } = useContractRead({
    address: MARKETPLACE_ADDRESS,
    abi: Marketplace?.abi,
    functionName: "getListedNfts",
    onSettled(data, error) {
      console.log("getListedNfts - Settled", { data, error });
    },
  });

  const { data: tokenURI, isError: isTokenURIError, isLoading: isLoadingTokenURI } = useContractRead({
    address: NFT_ADDRESS,
    abi: NFT?.abi,
    functionName: "tokenURI",
    args: [tokenId],
    onSettled(data, error) {
      console.log("tokenURI - Settled", { data, error });
    },
  });

  useEffect(() => { loadNFTs(); }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();

    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(listedNfts.map(async (i: any) => {
      try {
        const meta = await axios.get(`${tokenURI}`);
        const nft = {
          price: i.price,
          tokenId: i.tokenId,
          seller: i.seller,
          owner: i.buyer,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        console.log(`Listed NFT #${i}`, nft);
        return nft;
      } catch(err) {
        console.log(err);
        return null;
      }
    }));
    setNfts(nfts.filter((nft: any) => nft !== null));
    setLoadingState("loaded"); 
    console.log(`Loaded the ${nfts.length} listed NFTs`);
  }

  // async function buyNft(nft: any) {
  //   const web3Modal = new Web3Modal();
  //   const provider = await web3Modal.connect();
  //   const web3 = new Web3(provider);
  //   const networkId = await web3.eth.net.getId();
  //   const accounts = await web3.eth.getAccounts();
  //   await marketplaceContract?.methods.buyNft(NFT_ADDRESS, nft.tokenId).send({ from: accounts[0], value: nft.price });
  //   loadNFTs();
  // }

  useEffect(()=>{
    // console.log("LISTED: ", listed);
  }, []);

  return (
    <div className='flex flex-col min-h-screen w-full justify-start items-start p-8'>
      <Head>
        <title>Nemiwind</title>
        <meta name="description" content="Generated by Nemiwind" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={"flex flex-col space-y-16 w-full"}>
        <div className="flex flex-col w-full justify-center items-center">
          <div className="flex flex-col justify-end md:items-end">
            <a href="https://nextjs.org" className='text-4xl font-extrabold lowercase tracking-tighter italic'>Nemiwind</a>
            <h1 className={"font-light text-sm"}>
              A Nextjs, Wagmi, Tailwind starter site for instant experimentation
            </h1>
          </div>
        </div>

        <div className={"grid h-full space-y-4 md:space-y-8 lg:space-y-12 cursor-default items-between"}>
          <>
            {listedNfts}
          </>
        </div>
      </main>
    </div>
  );
}
