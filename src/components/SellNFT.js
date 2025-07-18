import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation } from "react-router";
import About from "./About";

export default function SellNFT () {
    const [formParams, updateFormParams] = useState({ name: '', description: '', price: ''});
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const location = useLocation();

    async function disableButton() {
        const listButton = document.getElementById("list-button")
        listButton.disabled = true
        listButton.style.backgroundColor = "grey";
        listButton.style.opacity = 0.3;
    }

    async function enableButton() {
        const listButton = document.getElementById("list-button")
        listButton.disabled = false
        listButton.style.backgroundColor = "#A500FF";
        listButton.style.opacity = 1;
    }

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e) {
        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            disableButton();
            updateMessage("Uploading image.. please dont click anything!")
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
                enableButton();
                updateMessage("")
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
        }
    }

    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const {name, description, price} = formParams;
        //Make sure that none of the fields are empty
        if( !name || !description || !price || !fileURL)
        {
            updateMessage("Please fill all the fields!")
            return -1;
        }

        const nftJSON = {
            name, description, price, image: fileURL
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function listNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            if(metadataURL === -1)
                return;
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            disableButton();
            updateMessage("Uploading NFT(takes 5 mins).. please dont click anything!")

            //Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

            //massage the params to be sent to the create NFT request
            const price = ethers.utils.parseUnits(formParams.price, 'ether')
            let listingPrice = await contract.getListPrice()
            listingPrice = listingPrice.toString()

            //actually create the NFT
            let transaction = await contract.createToken(metadataURL, price, { value: listingPrice })
            await transaction.wait()

            alert("Successfully listed your NFT!");
            enableButton();
            updateMessage("");
            updateFormParams({ name: '', description: '', price: ''});
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error"+e )
        }
    }

    console.log("Working", process.env);
    
    // return (
    //     <div className="">
    //     <Navbar></Navbar>
    //     <div className="flex flex-col place-items-center mt-10" id="nftForm">
    //         <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
    //         <h3 className="text-center font-bold text-purple-500 mb-8">Upload your NFT to the marketplace</h3>
    //             <div className="mb-4">
    //                 <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">NFT Name</label>
    //                 <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
    //             </div>
    //             <div className="mb-6">
    //                 <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">NFT Description</label>
    //                 <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="Axie Infinity Collection" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})}></textarea>
    //             </div>
    //             <div className="mb-6">
    //                 <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
    //                 <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
    //             </div>
    //             <div>
    //                 <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">Upload Image (&lt;500 KB)</label>
    //                 <input type={"file"} onChange={OnChangeFile}></input>
    //             </div>
    //             <br></br>
    //             <div className="text-red-500 text-center">{message}</div>
    //             <button onClick={listNFT} className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg" id="list-button">
    //                 List NFT
    //             </button>
    //         </form>
    //     </div>
    //     </div>
    // )

  return (
  <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
    <Navbar />
    <div className="flex flex-col items-center mt-10 px-4">
      <form
        className="w-full max-w-2xl bg-white bg-opacity-5 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-purple-900"
        id="nftForm"
      >
        <h3 className="text-center text-2xl font-extrabold text-purple-400 mb-8 drop-shadow-md">
          List your Digital Asset to the MarketPlace
        </h3>

        <div className="mb-5">
          <label className="block text-purple-300 text-sm font-semibold mb-2" htmlFor="name">
            Asset Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Axie#4563"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={e => updateFormParams({ ...formParams, name: e.target.value })}
            value={formParams.name}
          />
        </div>

        <div className="mb-5">
          <label className="block text-purple-300 text-sm font-semibold mb-2" htmlFor="description">
            Asset Description
          </label>
          <textarea
            id="description"
            placeholder="Axie Infinity Collection"
            rows="4"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={e => updateFormParams({ ...formParams, description: e.target.value })}
            value={formParams.description}
          ></textarea>
        </div>

        <div className="mb-5">
          <label className="block text-purple-300 text-sm font-semibold mb-2" htmlFor="price">
            Price (in ETH)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            placeholder="Min 0.01 ETH"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={e => updateFormParams({ ...formParams, price: e.target.value })}
            value={formParams.price}
          />
        </div>

        <div className="mb-5">
          <label className="block text-purple-300 text-sm font-semibold mb-2" htmlFor="image">
            Upload Image (&lt;500 KB)
          </label>
          <input
            type="file"
            className="text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            onChange={OnChangeFile}
          />
        </div>

        <div className="text-red-400 text-center text-sm mb-4">{message}</div>

        <button
          id="list-button"
          onClick={listNFT}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold shadow-lg transition duration-300 ease-in-out"
        >
          List Asset
        </button>
      </form>
    </div>
    <About />
  </div>
);


}