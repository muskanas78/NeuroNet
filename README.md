# 🧬 NeuroNet: The Decentralized Neural Wellness Protocol
MG3012 – Blockchain Technology | Final Project  
**Theme:** Cyberpunk / Bio-Tech  
**Token:** NeuroToken (NEURO) – ERC-20 Custom Implementation  
**Network:** Sepolia Testnet

---

## Team Members
- **Muskan Ahmed (23i-4145)**
- **Anaya Noor (23i-5521)**

---

# 1. Introduction

## 1.1 Problem Statement
Traditional wellness tracking systems are centralized, opaque, and do not reward users for consistent self-assessment. This lack of incentivization results in low engagement and weak habit development. Users do not own their emotional data, nor do they gain meaningful benefits from their participation.

## 1.2 Solution – NeuroNet dApp
NeuroNet introduces a decentralized wellness ecosystem using ERC-20 tokenization, streak mechanics, and on-chain emotional tracking.  
It provides:
- **Self-Sovereign User Data**
- **Tokenized Rewards via NEURO**
- **Gamified Habit Formation**
- **Dynamic Neural Avatar Feedback**

---

# 2. Core Features

## 2.1 Smart Contract Features (NeuroToken.sol)

| Function | Type | Description |
|---------|------|-------------|
| `constructor()` | Write | Mints initial supply to owner. |
| `submitMoodAssessment(mood, stress, energy)` | Core (Write) | Daily check-in. Mints tokens, updates streak, and applies bonuses. |
| `transfer(to, amount)` | ERC-20 (Write) | Transfers NEURO tokens. |
| `getUserStats(user)` | View | Returns mood, streak, check-ins, wellness score, and balance. |
| `balanceOf(account)` | View | Standard ERC-20 balance lookup. |

---

## 2.2 Frontend Features (HTML/CSS/JS)
- MetaMask + Ethers.js integration  
- Real-time NEURO balance updates  
- Streak counter and wellness score  
- Dynamic Neural Avatar (visual feedback)  
- User mood selection (emotions + sliders)  
- Token transfer interface  

---

# 3. Technical Architecture

## 3.1 Development Stack

| Category | Component | Role |
|---------|-----------|------|
| Smart Contract | Solidity ^0.8.20 | Token logic and reward mechanism |
| Deployment | Remix (Injected Provider) | Sepolia deployment + verification |
| Frontend | HTML, CSS, JavaScript | UI + wallet integration |
| Web3 Bridge | Ethers.js v5.7.2 | Contract calls and transactions |
| Theme | Custom Cyberpunk CSS, Particles.js | Visual experience |

---

## 3.2 Deployed Assets

| Asset | Details |
|-------|---------|
| **Contract Address** | `0x46C1100f7181f8De835F165aa9B744835BD0C189` |
| **Etherscan TX Hash** | `0xd8fc18f08ae4e746a7718be17c98a4edb51ac6c020d621439405645bdb98a369` |
| **Live dApp URL** | https://www.canva.com/design/DAG6Mk2jOdE/WPjsCmoc9DeJsb4XId_HsQ/edit?utm_content=DAG6Mk2jOdE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton |

---

# 4. Installation & Usage

## 4.1 Requirements
- MetaMask  
- Sepolia Testnet  
- Browser (Chrome/Brave recommended)  
- Node.js (optional for testing)

## 4.2 Steps to Run


### 1. Clone Repository
```bash
git clone https://github.com/muskanas78/NeuroNet
```
### 2. (Optional) Install Dependencies
```bash
npm install
```

### 3. Configure Contract Address

Update inside frontend/script.js:

const CONTRACT_ADDRESS = "0x46C1100f7181f8De835F165aa9B744835BD0C189";

### 4. Launch Frontend

Open:

frontend/index.html

### 5. Connect Wallet

Click CONNECT NEURAL LINK in the interface.

# 5. Project Structure
NEURONET-DAPP/
├── contracts/
│   └── NeuroToken.sol
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── artifacts/ (if mentioned in frontend, no need to create folder)
│   └── NeuroToken_Artifact.json   # ABI + Bytecode
├── screenshots/
│   └── documentation.pdf
    └── demo_link.txt
└── README.md
└── MIT License

# 6. Credits

Smart Contract Development, UI/UX and Frontend: Muskan Ahmed, Anaya Noor

Cyberpunk Design Inspiration: Blade Runner, Ghost in the Shell, Deus Ex, CyberPunk: EdgeRunner

Blockchain Tooling: Solidity, MetaMask, Remix, Ethers.js

 # 7. License

This project is released under the MIT License.

MIT License

Copyright (c) 2025 NeuroNet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...

# 8. NeuroNet Landing Page

<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/e9a8d028-b768-4a55-8f40-f669c4c717a0" />


# 9. Future Enhancements

- AI-based mood prediction

- Mobile App Integration

- DAO-based reward governance

- Multi-chain deployment

- Full analytics dashboard

# 10. Conclusion

NeuroNet combines blockchain incentives with wellness tracking to create a gamified, decentralized, and user-owned emotional health protocol. By merging ERC-20 tokenization with behavioral psychology, the system encourages healthier habits through transparency and tangible rewards.
```bash
git clone https://github.com/muskanas78/NeuroNet
