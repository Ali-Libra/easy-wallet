import { ethers } from "ethers";
import { ChainType } from "./chain";
import { JsonRpcProvider } from 'ethers';

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
    const address = '0xdAC17F958D2ee523a2206206994597C13D831EC7';
    console.log("getERC20Balance", ethers.getAddress(address)); // ✅ 应该成功并输出同样的地址

    const checkedToken = ethers.getAddress(tokenAddress);
    const checkedUser = ethers.getAddress(userAddress);
    const contract = new ethers.Contract(checkedToken, ERC20_ABI, provider);

    const [symbol, decimals, balance] = await Promise.all([
      contract.symbol(),
      contract.decimals(),
      contract.balanceOf(checkedUser),
    ]);

    const formatted = ethers.formatUnits(balance, decimals);
    return formatted;
  }

  getByName(chain: string): Erc20Info[] | undefined {
    return this.erc20List.filter((info) => info.chain === chain);
  }
}

export const erc20Manager = new Erc20Manager([
  {
    name: "usdt",
    chain: ChainType.ETH,
    address: "0xdAC17F958D2ee523a2206206994597C13D831EC7",
  },
  {
    name: "usdc",
    chain: ChainType.ETH,
    address: "0xA0b86991C6218B36c1d19D4a2e9Eb0cE3606eB48",
  },
  {
    name: "usdt",
    chain: ChainType.ETH_TEST,
    address: "0x863aE464D7E8e6F95b845FD3AF0F9A2B2034d6dD",
  },
  {
    name: "usdt",
    chain: ChainType.SOLANA,
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  },
  {
    name: "usdc",
    chain: ChainType.SOLANA,
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  {
    name: "usdt",
    chain: ChainType.BNB,
    address: "0x55d398326f99059fF775485246999027B3197955",
  },
  {
    name: "usdc",
    chain: ChainType.BNB,
    address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  },
]);