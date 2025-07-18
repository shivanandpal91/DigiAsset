import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState ,useEffect} from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import About from "./About";

export default function Marketplace() {
const sampleData = [
    {
        "name": "Asset 01",
        "description": " #1st NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
        "image":"../public/logo_2.png",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "Asset 02",
        "description": "#2nd  NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmdhoL9K8my2vi3fej97foiqGmJ389SMs55oC5EdkrxF2M",
        "image":"../public/logo_2.png",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "Asset 03",
        "description": "#3rd NFT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
        "image":"./public/logo192.png",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

// async function getAllNFTs() {
//     const ethers = require("ethers");
//     //After adding your Hardhat network to your metamask, this code will get providers and signers
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     //Pull the deployed contract instance
//     let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
//     //create an NFT Token
//     let transaction = await contract.getAllNFTs()

//     //Fetch all the details of every NFT from the contract and display
//     const items = await Promise.all(transaction.map(async i => {
//         var tokenURI = await contract.tokenURI(i.tokenId);
//         console.log("getting this tokenUri", tokenURI);
//         tokenURI = GetIpfsUrlFromPinata(tokenURI);
//         let meta = await axios.get(tokenURI);
//         meta = meta.data;

//         let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
//         let item = {
//             price,
//             tokenId: i.tokenId.toNumber(),
//             seller: i.seller,
//             owner: i.owner,
//             image: meta.image,
//             name: meta.name,
//             description: meta.description,
//         }
//         return item;
//     }))

//     updateFetched(true);
//     updateData(items);
// }

// if(!dataFetched)
//     getAllNFTs();


async function getAllNFTs() {
  const ethers = require("ethers");

  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // ✅ Ask user to connect wallet if not already connected
  const accounts = await provider.send("eth_requestAccounts", []);
  if (!accounts || accounts.length === 0) {
    alert("Please connect to MetaMask.");
    return;
  }

  const signer = provider.getSigner();
  const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

  try {
    const transaction = await contract.getAllNFTs();

    const items = await Promise.all(transaction.map(async i => {
      let tokenURI = await contract.tokenURI(i.tokenId);
      console.log("Token URI:", tokenURI);

      tokenURI = GetIpfsUrlFromPinata(tokenURI);
      const meta = (await axios.get(tokenURI)).data;

      const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      return {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      };
    }));

    updateFetched(true);
    updateData(items);
  } catch (err) {
    console.error("Error fetching NFTs:", err);
    if (err instanceof Error) {
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    } else {
    console.error("Full error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    }
  }
}

useEffect(() => {
  if (!dataFetched) getAllNFTs();
}, [dataFetched]);



return (
  <div className="min-h-screen bg-gray-900">
    <Navbar />
    <div className="flex flex-col items-center mt-20 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
        Top NFTs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl w-full">
        {data.map((value, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl hover:scale-105 transition-transform duration-300"
          >
            <NFTTile data={value} />
          </div>
        ))}
      </div>
    </div>
    <About />
  </div>
);


}

