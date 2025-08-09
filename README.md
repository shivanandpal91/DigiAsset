
💎 DigiAssets
A decentralized marketplace where users can mint, buy, and sell DigiAssets (NFT tokens) built on the Ethereum blockchain using the Sepolia testnet.

📌 Table of Contents

    Features
    Tech Stack
    Installation & Setup
    Environment Variables & Keys
    Run the Application

🚀 Features




🔐 Authentication & Wallet Connection

    Connect with MetaMask wallet for secure authentication.
    Perform blockchain transactions on the Sepolia testnet.

🎨 DigiAsset (NFT Token) Management

    Mint new DigiAssets with metadata stored on IPFS via Pinata.
    View all DigiAssets listed on the marketplace.

🛒 Marketplace Features

    Buy DigiAssets directly from the marketplace.
    Sell owned DigiAssets by listing them with price & details.

📑 DigiAsset Details

    View detailed metadata & ownership records for each DigiAsset (NFT token).
    Preview DigiAsset image before purchase.
    
🛠 Tech Stack

    Frontend:
        React.js
        Tailwind CSS
        React Router DOM
    
    Smart Contracts:
        Solidity
        Hardhat
    
    Blockchain & API Integration:
        Ethers.js
        Alchemy (Sepolia node provider)
        Pinata (IPFS decentralised storage)
    
    Authentication & Security:
        MetaMask Wallet

⚙️ Installation & Setup

1️⃣ Clone the repository

    git clone https://github.com/shivanandpal91/DigiAsset-NFT-Marketplace.git
    cd DigiAsset-NFT-Marketplace
2️⃣ Install dependencies

    npm install
    
🔑 Environment Variables & Keys
Create a .env file in the root directory and add:

    REACT_APP_PINATA_KEY=your_pinata_api_key
    REACT_APP_PINATA_SECRET=your_pinata_secret_key
    REACT_APP_ALCHEMY_API_URL=your_sepolia_alchemy_url
    REACT_APP_SEPOLIA_PRIVATE_KEY=your_wallet_private_key
Where to get these keys:

    PINATA API Key & Secret → https://pinata.cloud/ → Sign up → API Keys section.
    Alchemy API URL → https://alchemy.com/ → Create a new Ethereum Sepolia App → View API Key → HTTP URL.
    Sepolia Private Key → Open MetaMask → Account Settings → Export Private Key (⚠ Keep it secret!).


▶️ Run the Application

    # Deploy smart contracts
    npx hardhat run scripts/deploy.js --network sepolia
    
    # Start frontend
    npm run dev
    
# The app will run at:

     http://localhost:3000
