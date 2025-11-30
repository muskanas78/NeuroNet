NeuroNet: The Decentralized Neural Wellness Protocol

MG3012 - Blockchain Technology for Business | Final Project

Theme: Cyberpunk / Bio-Tech
Token: NeuroToken (NEURO) - ERC-20 Custom Implementation
Deployment Network: Sepolia Testnet

Team Members:

Muskan Ahmed (23i-4145)

Anaya Noor (23i-5521)

1. Project Overview & Problem Statement

1.1. Problem Statement

Traditional mental health and wellness tracking relies on centralized applications and often lacks tangible, immediate rewards for user consistency. This results in poor long-term engagement and little incentive for individuals to actively commit to regular self-assessment.

1.2. Solution: The NeuroNet dApp

NeuroNet solves this by leveraging blockchain technology and gamification. By wrapping the ERC-20 standard with custom wellness logic, we create a transparent, decentralized protocol that incentivizes daily self-care.

Data Ownership: User statistics (mood, streak, earnings) are stored immutably on-chain.

Tokenization: The NeuroToken (NEURO) provides a quantifiable, liquid reward for participation.

Gamification: Daily check-ins earn tokens, with increasing bonuses for maintaining a Streak, encouraging habit formation.

2. Features and Core Functionality

2.1. Contract Functionality (NeuroToken.sol)

The smart contract serves as the backbone, handling token creation, distribution, and user state management.

Function

Type

Description

constructor

Write

Mints the initial supply of NEURO to the contract owner.

submitMoodAssessment(moodScore, stressLevel, energyLevel)

Core Logic (Write)

Executes the daily check-in. Mints NEURO tokens to the user, applies a Streak Bonus, updates wellness metrics, and enforces the "once per day" rule.

transfer(address to, uint256 amount)

ERC-20 (Write)

Allows users to spend or transfer their earned NEURO tokens.

getUserStats(address user)

View

Retrieves the user's complete on-chain profile: balance, current mood, total check-ins, and streak length.

balanceOf

ERC-20 (View)

Returns the standard ERC-20 token balance.

2.2. Frontend Functionality (index.html, script.js)

Wallet Integration: Connects seamlessly via MetaMask/Ethers.js to fetch user data and sign transactions.

Real-Time Data: Displays NEURO Balance, Wellness Score, Check-in Streak, and Lifetime Earnings, updating instantly post-transaction.

Dynamic Avatar: The Neural Avatar dynamically changes based on the user's computed Wellness Score, providing visual feedback.

Interactive Assessment: Intuitive UI for selecting mood and adjusting slider inputs for Stress/Energy.

ERC-20 Transfer: Dedicated form for sending NEURO tokens to any recipient address.

3. Technical Implementation Details

3.1. Development Stack

Category

Component / Version

Role

Smart Contract

Solidity ^0.8.20

Defines token logic and minting protocol.

Deployment Tool

Remix IDE (Injected Provider)

Used for compilation, deployment, and verification on Sepolia.

Frontend Language

HTML5, CSS3, JavaScript

Responsive user interface design.

Blockchain Bridge

Ethers.js v5.7.2

Connects frontend functions to the deployed contract ABI.

Styling

Custom Cyberpunk CSS + Particles.js

Provides the immersive visual theme and animations.

3.2. Deployed Assets

Asset

Details

Deployed Contract Address

0x46C1100f7181f8De835F165aa9B744835BD0C189

Etherscan Transaction Hash

0xd8fc18f08ae4e746a7718be17c98a4edb51ac6c020d621439405645bdb98a369

Live dApp/Canvas URL

[PASTE YOUR LIVE DAPP/CANVAS URL HERE]

4. Setup and Run Instructions

This project requires Node.js/npm and MetaMask installed in your browser.

Clone/Unzip Project: Extract the NEURONET-DAPP ZIP file.

Install Dependencies: (Optional, if you plan to run tests): Run npm install in the root folder.

Check Contract Address: Verify that the CONTRACT_ADDRESS in frontend/script.js matches the deployed address above.

Run Frontend: Open the frontend/index.html file in a modern web browser.

Connect Wallet: Ensure MetaMask is set to the Sepolia Testnet and click "CONNECT NEURAL LINK."

5. Submission Structure

The final ZIP file contains the following structure, including the compiled contract artifacts (artifacts/) replacing the standard framework configuration files:

├── contracts/
│ └── NeuroToken.sol
├── frontend/
│ ├── index.html
│ ├── script.js
│ └── style.css
├── artifacts/  
│ └── NeuroToken_Artifact.json <-- ABI and Metadata
├── README.md
└── screenshots/

I will ensure the Bytecode is available in the artifacts folder for verification purposes.
