# ☕ Buy Me a Coffee (Web3 dApp)

A simple Web3 application that allows users to fund a smart contract and withdraw funds using **Viem, TypeScript, and Vite**, powered by a local **Anvil blockchain**.

---

## 🚀 Overview

This project demonstrates:

- Connecting wallet via MetaMask  
- Funding a smart contract with ETH  
- Withdrawing funds (owner)  
- Reading contract balance  
- Real-time UI feedback with toast notifications  

---

## 🧠 Tech Stack

- **TypeScript** – Application logic  
- **Viem** – Ethereum interactions  
- **Vite** – Frontend dev server  
- **Anvil** – Local Ethereum node (Foundry)  
- **Solidity** – Smart contract  

---

## 📂 Project Structure

```
├── index.html
├── index-ts.ts
├── constants-ts.ts
├── fundme-anvil.json
├── tsconfig.json
├── package.json
```

---

## ⚙️ Setup

### 1. Install dependencies

```bash
pnpm install
```

---

### 2. Start local blockchain

```bash
pnpm anvil
```

---

### 3. Start frontend

```bash
pnpm dev
```

---

### 4. Open in browser

http://localhost:5173

---

## 🛠️ Scripts

```json
"scripts": {
  "dev": "vite",
  "anvil": "anvil --load-state fundme-anvil.json",
  "format": "prettier --write .",
  "compile": "tsc --project tsconfig.json"
}
```

---

## 💡 Features

- 🔌 Connect MetaMask wallet  
- 💸 Fund contract with ETH  
- 📊 Fetch contract balance  
- 💰 Withdraw funds (owner only)  
- 🔔 Toast notifications for UX  
- ⚡ Fast dev setup with Vite  

---

## ⚠️ Requirements

- MetaMask installed  
- Node.js (v18+)  
- Foundry (for Anvil)  

---

## 🧪 How to Use

1. Connect your wallet  
2. Enter ETH amount  
3. Click **Buy Coffee** to fund  
4. Click **Get Balance** to check funds  
5. Click **Withdraw** (owner only)  

---

## 🔐 Notes

- Use test accounts only  
- Ensure MetaMask is connected to:
  http://localhost:8545  
  Chain ID: 31337  
- Import Anvil private keys into MetaMask  

---