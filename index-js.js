import { createWalletClient, custom, createPublicClient, parseEther, defineChain, formatEther } from "https://esm.sh/viem";
import { contractAddress, abi } from "./constants-js.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmountInput");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

let walletClient;
let publicClient;

console.log("walletClient: ", walletClient);
console.log("publicClient: ", publicClient);

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        await walletClient.requestAddresses();
        connectButton.innerHTML = "Connected";
        console.log("Connected to MetaMask");
    } else {
        connectButton.innerHTML = "Please install MetaMask";
    }
};

async function fund() {
    const ethAmount = ethAmountInput.value;
    console.log(`Funding with ${ethAmount} ETH...`);

    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        const [connectedAddress] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });

        console.log("parseEther(ethAmount): ", parseEther(ethAmount));

        const {request} = await publicClient.simulateContract({
            address: contractAddress,
            abi: abi,
            functionName: "fund",
            account: connectedAddress,
            chain: currentChain,
            value: parseEther(ethAmount),
        });
        console.log("request: ", request);
        const txHash = await walletClient.writeContract(request);
        console.log("Transaction hash: ", txHash);
    } else {
        connectButton.innerHTML = "Please install MetaMask";
    }
};

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({
            transport: custom(window.ethereum),
        }); 
        const balance = await publicClient.getBalance({
            address: contractAddress,
        });
        console.log(`Contract balance: ${formatEther(balance)}`);
    }
};

async function withdraw() {
    const ethAmount = ethAmountInput.value;
    console.log(`Withdrawing ${ethAmount} ETH...`);

    if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });
        const [connectedAddress] = await walletClient.requestAddresses();
        const currentChain = await getCurrentChain(walletClient);

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });

        const {request} = await publicClient.simulateContract({
            address: contractAddress,
            abi: abi,
            functionName: "withdraw",
            account: connectedAddress,
            chain: currentChain,
        });
        console.log("request: ", request);
        const txHash = await walletClient.writeContract(request);
        console.log("Transaction hash: ", txHash);  
    } else {
        connectButton.innerHTML = "Please install MetaMask";
    }
};

async function getCurrentChain(client) {
  const chainId = await client.getChainId()
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  })
  return currentChain
}

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;