import { ethers } from "ethers";
import { ChainType } from "./chain";
import { JsonRpcProvider } from 'ethers';
import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount, getMint, getAssociatedTokenAddress, TokenAccountNotFoundError } from '@solana/spl-token';

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
  value?: string;
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

    const ata = await getAssociatedTokenAddress(mint, user);
    try {
      const accountInfo = await getAccount(connection, ata);
      const mintInfo = await getMint(connection, mint);
      const balance = Number(accountInfo.amount) / 10 ** mintInfo.decimals;
      return balance.toString();
    } catch (e) {
      if (e instanceof TokenAccountNotFoundError) {
        // 账户不存在，余额为0
        return "0.0";
      }
      throw e; // 其他错误继续抛
    }
  }

  getByName(chain: string): Erc20Info[] | undefined {
    return this.erc20List.filter((info) => info.chain === chain);
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
    chain: ChainType.ETH_TEST,
    address: "0x863aE464D7E8e6F95b845FD3AF0F9A2B2034d6dD",
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