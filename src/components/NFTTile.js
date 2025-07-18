import {
    BrowserRouter as Router,
    Link,
  } from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";

function NFTTile (data) {
    const newTo = {
        pathname:"/nftPage/"+data.data.tokenId
    }

    const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);

    
  return (
    <Link to={newTo}>
      <div className="group transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-gray-600 ml-12 mt-5 mb-12 flex flex-col items-center rounded-2xl w-48 md:w-72 bg-[#1c1c1e]">
        <img
          src={IPFSUrl}
          alt=""
          className="w-80 h-70 rounded-t-2xl object-cover"
        />
        <div className="text-white w-full p-3 bg-gradient-to-t from-[#2f2f2f] to-transparent rounded-b-2xl pt-5 -mt-16 z-10">
          <strong className="text-lg block mb-1">{data.data.name}</strong>
          <p className="text-sm text-gray-300 truncate">
            {data.data.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default NFTTile;
