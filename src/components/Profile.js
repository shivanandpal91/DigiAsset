import Navbar from "./Navbar";
import { useLocation, useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import NFTTile from "./NFTTile";
import About from "./About";

export default function Profile () {
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");

    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        let sumPrice = 0;
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

        //create an NFT Token
        let transaction = await contract.getMyNFTs()

        /*
        * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
        * and creates an object of information that is to be displayed
        */
        
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            }
            sumPrice += Number(price);
            return item;
        }))

        updateData(items);
        updateFetched(true);
        updateAddress(addr);
        updateTotalPrice(sumPrice.toPrecision(3));
    }

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

    // return (
    //     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
    //         <Navbar />
            
    //         <div className="container mx-auto px-4 py-10">
    //             <div className="text-center space-y-3">
    //                 <h2 className="text-3xl md:text-4xl font-bold text-emerald-400">Wallet Address</h2>
    //                 <p className="break-words text-sm md:text-base text-gray-300 max-w-2xl mx-auto">{address}</p>
    //             </div>

    //             <div className="mt-10 flex flex-col md:flex-row justify-center gap-12 text-center">
    //                 <div className="bg-gray-800 border border-emerald-500 p-6 rounded-2xl shadow-md">
    //                     <h3 className="text-lg md:text-xl font-semibold text-emerald-300">No. of NFTs</h3>
    //                     <p className="text-2xl font-bold mt-2 text-white">{data.length}</p>
    //                 </div>
    //                 <div className="bg-gray-800 border border-emerald-500 p-6 rounded-2xl shadow-md">
    //                     <h3 className="text-lg md:text-xl font-semibold text-emerald-300">Total Value</h3>
    //                     <p className="text-2xl font-bold mt-2 text-white">{totalPrice} ETH</p>
    //                 </div>
    //             </div>

    //             <div className="mt-14 text-center">
    //                 <h2 className="text-3xl font-bold mb-6 text-emerald-400">Your NFTs</h2>
    //                 <div className="flex justify-center flex-wrap gap-6">
    //                     {data.map((value, index) => (
    //                         <NFTTile data={value} key={index} />
    //                     ))}
    //                 </div>
    //                 {data.length === 0 && (
    //                     <p className="mt-10 text-lg text-red-400">Oops, No NFT data to display (Are you logged in?)</p>
    //                 )}
    //             </div>
    //         </div>
    //     </div>
    // );



    return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
    <Navbar />

    <div className="container mx-auto px-4 py-10">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-400">Wallet Address</h2>
        <p className="break-words text-sm md:text-base text-gray-300 max-w-2xl mx-auto">{address}</p>
      </div>

      <div className="mt-10 flex flex-col md:flex-row justify-center gap-12 text-center">
        <div className="bg-gray-800 border border-emerald-500 p-6 rounded-2xl shadow-lg hover:shadow-emerald-600 transition duration-300 ease-in-out">
          <h3 className="text-lg md:text-xl font-semibold text-emerald-300">No. of Assets you own</h3>
          <p className="text-2xl font-bold mt-2 text-white">{data.length}</p>
        </div>
        <div className="bg-gray-800 border border-emerald-500 p-6 rounded-2xl shadow-lg hover:shadow-emerald-600 transition duration-300 ease-in-out">
          <h3 className="text-lg md:text-xl font-semibold text-emerald-300">Total Value</h3>
          <p className="text-2xl font-bold mt-2 text-white">{totalPrice} ETH</p>
        </div>
      </div>

      <div className="mt-14 text-center">
        <h2 className="text-3xl font-bold mb-6 text-emerald-400">Your Assets</h2>
        <div className="flex justify-center flex-wrap gap-6">
          {data.map((value, index) => (
            <NFTTile data={value} key={index} />
          ))}
        </div>
        {data.length === 0 && (
          <p className="mt-10 text-lg ">
                <div className="text-red-400 font-medium text-lg px-6 pb-2">
                    {address !== "0x"
                    ? `Oops, No data to display.`
                    : "Are you logged in?"}
                </div>
           
          </p>
        )}
      </div>
    </div>
    <About />
  </div>
);

};