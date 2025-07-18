import { ethers, JsonRpcProvider } from "ethers";
import { ChainType } from "./chain";
import { Connection, PublicKey } from "@solana/web3.js";

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)'
];

export type Erc20Info = {
  name: string;
  chain: ChainType;
  address: string;
};

class Erc20Manager {
  private erc20List: Erc20Info[];
  constructor(initialData?: Erc20Info[]) {
    this.erc20List = initialData || [];
  }

  async getERC20Balance(
    tokenAddress: string,
    userAddress: string,
    provider: JsonRpcProvider
  ): Promise<string> {
    const checkedToken = ethers.getAddress(tokenAddress);
    const checkedUser = ethers.getAddress(userAddress);
    const contract = new ethers.Contract(checkedToken, ERC20_ABI, provider);

    const [_, decimals, balance] = await Promise.all([
      contract.symbol(),
      contract.decimals(),
      contract.balanceOf(checkedUser),
    ]);

    const formatted = ethers.formatUnits(balance, decimals);
    return formatted;
  }
  async getSPLTokenBalance(
    mintAddress: string,
    userAddress: string,
    connection: Connection
  ): Promise<string> {
    const mint = new PublicKey(mintAddress);
    const user = new PublicKey(userAddress);

    async function getUsdtBalance() {
      const associatedTokenAddress = await PublicKey.findProgramAddress(
        [
          user.toBuffer(),
          new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA').toBuffer(), // SPL Token Program ID
          mint.toBuffer()
        ],
        new PublicKey('ATokenGPvbdGVxr1dE3S6pPnxAqYdzfqbGJdYdz1hJ4') // Associated Token Program ID
      )

      const tokenAccountAddress = associatedTokenAddress[0]

      const accountInfo = await connection.getParsedAccountInfo(tokenAccountAddress)

      if (!accountInfo.value) {
        console.log('USDT Token Account 不存在')
        return 0
      }

      const parsedInfo = (accountInfo.value.data as any).parsed.info
      const amount = parsedInfo.tokenAmount.uiAmount

      console.log(`USDT 余额: ${amount}`)
      return amount
    }

    return getUsdtBalance()
  }

  getByName(chain: string): Erc20Info[] | undefined {
    return this.erc20List.filter((info) => info.chain === chain);
  }

  getAvatar(name: string): string {
    if (name === "USDT") {
      return "/USDT.png";
    } else if (name === "USDC") {
      return "/USDC.png";
    } else {
      return "/dogdog.png"
    }
  }
}

export const erc20Manager = new Erc20Manager([
  {
    name: "USDT",
    chain: ChainType.ETH,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  {
    name: "USDC",
    chain: ChainType.ETH,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  {
    name: "USDT",
    chain: ChainType.SOLANA,
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  },
  {
    name: "USDC",
    chain: ChainType.SOLANA,
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    name: "USDT",
    chain: ChainType.BNB,
    address: "0x55d398326f99059fF775485246999027B3197955",
  },
  {
    name: "USDC",
    chain: ChainType.BNB,
    address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  },
]);