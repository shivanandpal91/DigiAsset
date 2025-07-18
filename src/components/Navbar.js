// import logo from '../logo_3.png';
// import fullLogo from '../full_logo.png';
import logo1 from '../logo2.jpg'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ethers } from "ethers"; 
function Navbar() {

const [connected, toggleConnect] = useState(false);
const location = useLocation();
const [currAddress, updateAddress] = useState('0x');

// async function getAddress() {
//   const ethers = require("ethers");
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   const signer = provider.getSigner();
//   const addr = await signer.getAddress();
//   updateAddress(addr);
// }

async function getAddress() {
  const ethers = require("ethers");
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const accounts = await provider.send("eth_accounts", []);
  if (!accounts || accounts.length === 0) {
    console.warn("No accounts connected");
    return;
  }

  const signer = provider.getSigner();
  const addr = await signer.getAddress();
  updateAddress(addr);
}


function updateButton() {
  const ethereumButton = document.querySelector('.enableEthereumButton');
  ethereumButton.textContent = "Connected";
  ethereumButton.classList.remove("hover:bg-blue-70");
  ethereumButton.classList.remove("bg-blue-500");
  ethereumButton.classList.add("hover:bg-green-70");
  ethereumButton.classList.add("bg-green-500");
}

async function connectWebsite() {

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if(chainId !== '0xaa36a7')
    {
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
     })
    }  
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        updateButton();
        console.log("here");
        getAddress();
        window.location.replace(location.pathname)
      });
}

  // useEffect(() => {
  //   // if(window.ethereum === undefined)
  //     // return;
  //   let val = window.ethereum.isConnected();
  //   if(val)
  //   {
  //     console.log("here");
  //     getAddress();
  //     toggleConnect(val);
  //     updateButton();
  //   }

  //   window.ethereum.on('accountsChanged', function(accounts){
  //     window.location.replace(location.pathname)
  //   })
  // },[]);
useEffect(() => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.send("eth_accounts", []).then((accounts) => {
      if (accounts.length > 0) {
        getAddress();
        toggleConnect(true);
        updateButton();
      }
    });

    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.replace(location.pathname);
    });
  }
}, []);

    // return (
    //   <div className="">
    //     <nav className="w-screen">
    //       <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
    //       <li className='flex items-end ml-5 pb-2'>
    //         <Link to="/">
    //         <img src={fullLogo} alt="" width={120} height={120} className="inline-block -mt-2"/>
    //         <div className='inline-block font-bold text-xl ml-2'>
    //           NFT Marketplace
    //         </div>
    //         </Link>
    //       </li>
    //       <li className='w-2/6'>
    //         <ul className='lg:flex justify-between font-bold mr-10 text-lg'>
    //           {location.pathname === "/" ? 
    //           <li className='border-b-2 hover:pb-0 p-2'>
    //             <Link to="/">Marketplace</Link>
    //           </li>
    //           :
    //           <li className='hover:border-b-2 hover:pb-0 p-2'>
    //             <Link to="/">Marketplace</Link>
    //           </li>              
    //           }
    //           {location.pathname === "/sellNFT" ? 
    //           <li className='border-b-2 hover:pb-0 p-2'>
    //             <Link to="/sellNFT">List My NFT</Link>
    //           </li>
    //           :
    //           <li className='hover:border-b-2 hover:pb-0 p-2'>
    //             <Link to="/sellNFT">List My NFT</Link>
    //           </li>              
    //           }              
    //           {location.pathname === "/profile" ? 
    //           <li className='border-b-2 hover:pb-0 p-2'>
    //             <Link to="/profile">Profile</Link>
    //           </li>
    //           :
    //           <li className='hover:border-b-2 hover:pb-0 p-2'>
    //             <Link to="/profile">Profile</Link>
    //           </li>              
    //           }  
    //           <li>
    //             <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWebsite}>{connected? "Connected":"Connect Wallet"}</button>
    //           </li>
    //         </ul>
    //       </li>
    //       </ul>
    //     </nav>
    //     <div className='text-white text-bold text-right mr-10 text-sm'>
    //       {currAddress !== "0x" ? "Connected to":"Not Connected. Please login to view NFTs"} {currAddress !== "0x" ? (currAddress.substring(0,15)+'...'):""}
    //     </div>
    //   </div>
    // );

    return (
    <div className="w-full bg-gradient-to-b from-[#0f172a] to-[#1e293b] shadow-md">
      <nav className="w-full">
        <ul className="flex flex-wrap items-center justify-between px-6 py-4 text-white">
          <li className="flex items-center gap-3">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo1} alt="logo" className="h-12 w-auto" />
              <span className="text-2xl font-extrabold text-cyan-400 hover:text-cyan-300 transition duration-300">
                DigiAssets
              </span>
            </Link>
          </li>

          <li className="w-full lg:w-2/3">
            <ul className="flex flex-wrap justify-end items-center gap-6 font-semibold text-lg">
              <li
                className={`p-2 border-b-2 ${
                  location.pathname === "/" ? "border-cyan-400" : "border-transparent hover:border-cyan-300"
                } transition duration-300`}
              >
                <Link to="/">MarketPlace</Link>
              </li>
              <li
                className={`p-2 border-b-2 ${
                  location.pathname === "/sellNFT" ? "border-cyan-400" : "border-transparent hover:border-cyan-300"
                } transition duration-300`}
              >
                <Link to="/sellNFT">Create Asset</Link>
              </li>
              <li
                className={`p-2 border-b-2 ${
                  location.pathname === "/profile" ? "border-cyan-400" : "border-transparent hover:border-cyan-300"
                } transition duration-300`}
              >
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button
                  onClick={connectWebsite}
                  className={`enableEthereumButton px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition duration-300
                    ${connected ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}`}
                >
                  {connected ? "Connected" : "Connect Wallet"}
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div className="text-white font-medium text-sm text-right px-6 pb-2">
        {currAddress !== "0x"
          ? `Connected to: ${currAddress.substring(0, 15)}...`
          : "Not Connected. Please login to view Assets"}
      </div>
    </div>
  );

  }

  export default Navbar;