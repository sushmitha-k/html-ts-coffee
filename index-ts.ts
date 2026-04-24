import {
  createWalletClient,
  custom,
  formatEther,
  parseEther,
  defineChain,
  createPublicClient,
  type WalletClient,
  type PublicClient,
} from "viem";
import "viem/window";
import { abi, contractAddress } from "./constants-ts";

const connectButton = document.getElementById("connectButton") as HTMLButtonElement
const fundButton = document.getElementById("fundButton") as HTMLButtonElement
const balanceButton = document.getElementById("balanceButton") as HTMLButtonElement
const withdrawButton = document.getElementById("withdrawButton") as HTMLButtonElement
const ethAmountInput = document.getElementById("ethAmountInput") as HTMLInputElement

let walletClient: WalletClient
let publicClient: PublicClient

function showToast(message: string, type: "success" | "error" | "info" = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function getValidEthAmount(): string | null {
  const value = ethAmountInput.value.trim();

  if (!value) {
    showToast("Please enter an amount", "error");
    return null;
  }

  const num = Number(value);

  if (isNaN(num) || num <= 0) {
    showToast("Enter a valid ETH amount", "error");
    return null;
  }

  return value;
}

async function connect(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    })
    await walletClient.requestAddresses()
    connectButton.innerHTML = "Connected"
    showToast("Wallet connected", "success")
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

export async function fund(): Promise<void> {
  const ethAmount = getValidEthAmount();
  if (!ethAmount) return; 
  console.log(`Funding with ${ethAmount}...`)

  if (typeof window.ethereum !== "undefined") {
    try {
      walletClient = createWalletClient({
        transport: custom(window.ethereum),
      })
      const addresses = await walletClient.requestAddresses()
      const account: string = addresses[0]
      const currentChain = await getCurrentChain(walletClient)

      console.log("Processing transaction...");
      showToast("Processing transaction...", "info");
      publicClient = createPublicClient({
        transport: custom(window.ethereum),
      })
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi,
        functionName: "fund",
        account,
        chain: currentChain,
        value: parseEther(ethAmount),
      })
      const hash = await walletClient.writeContract(request);
      console.log("Transaction processed: ", hash);
      showToast("Transaction successful!", "success");
      ethAmountInput.value = "";
    } catch (error) {
      console.error(error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

export async function getBalance(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    try {
      publicClient = createPublicClient({
        transport: custom(window.ethereum),
      })
      const balance = await publicClient.getBalance({
        address: contractAddress,
      })
      console.log(formatEther(balance))
      showToast(`Balance: ${formatEther(balance)} ETH`, "info")
    } catch (error) {
      showToast("Transaction failed", "error");
      console.error(error)
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask"
  }
}

export async function withdraw(): Promise<void> {
  const ethAmount = getValidEthAmount();
  if (!ethAmount) return; 

  if (typeof window.ethereum !== "undefined") {
    try {
      walletClient = createWalletClient({
        transport: custom(window.ethereum),
      })
      publicClient = createPublicClient({
        transport: custom(window.ethereum),
      })
      const addresses = await walletClient.requestAddresses()
      const account: `0x${string}` = addresses[0] as `0x${string}`
      const currentChain = await getCurrentChain(walletClient)

      console.log("Processing transaction...")
      showToast("Withdrawing...", "info");
      const { request } = await publicClient.simulateContract({
        account,
        address: contractAddress,
        abi,
        functionName: "withdraw",
        chain: currentChain,
      })
      const hash = await walletClient.writeContract(request)
      ethAmountInput.value = "";
      console.log("Transaction processed: ", hash)
      showToast("Transaction successful!", "success")
    } catch (error) {
      showToast("Transaction failed", "error");
      console.error(error)
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask"
  }
}

async function getCurrentChain(client: WalletClient): Promise<ReturnType<typeof defineChain>> {
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
  return currentChain;
}

// Attach event listeners
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;