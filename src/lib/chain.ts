import { format, insertWithLimit } from "@lib/util";
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english'
import { Keypair } from "@solana/web3.js";
import { ethers } from 'ethers';

// 定义一个地址信息结构体
export type AddressInfo = {
  name: string; //链的名字
  avatar: string; // 头像
  domain: string; //链的地址
  isTest: boolean;
  selfDomain?: string; //自定义地址
  useLib: ChainCurrency;
  history?: string[]; //交易历史
};

export enum ChainCurrency {
  ETH = 'ETH',
  SOLANA = 'SOL'
}

export enum ChainType {
  ETH = 'Ethereum',
  ETH_TEST = 'Sepolia',
  SOLANA = 'Solana',
  SOLANA_TEST = 'Solana-dev',
  BNB = 'BNB',
  BNB_TEST = 'BNB-test'
}

const alchemyUrl = "https://{domain}.g.alchemy.com/v2/{key}"
const SELF_DOMAIN_KEY = "selfDomain:"
const HISTORY_KEY = "history:"

// 地址管理器类
class ChainManager {
  private addressMap: Map<string, AddressInfo>;

  constructor(initialData?: AddressInfo[]) {
    this.addressMap = new Map();

    // 初始化数据
    if (initialData) {
      for (const item of initialData) {
        this.addressMap.set(item.name, item);
      }
    }
  }

  initSelfDomain() {
    for (const [_, address] of this.addressMap) {
      const saveDomain = localStorage.getItem(SELF_DOMAIN_KEY + address.name)
      if (saveDomain) {
        address.selfDomain = saveDomain
      }
    }
  }

  setSelfDomain(name: string, domain: string) {
    const address = this.addressMap.get(name)
    if (address) {
      address.selfDomain = domain
      localStorage.setItem(SELF_DOMAIN_KEY + name, domain);
    }
  }

  initSendHistory() {
    for (const [_, address] of this.addressMap) {
      const raw = localStorage.getItem(HISTORY_KEY + address.name)
      if (raw) {
        address.history = JSON.parse(raw)
      }
    }
  }

  addSendHistory(name: string, history: string) {
    const address = this.addressMap.get(name)
    if (address) {
      if (!address.history) {
        address.history = [];
      }
      insertWithLimit(address.history, history)
      localStorage.setItem(HISTORY_KEY + name, JSON.stringify(address.history));
    }
  }

  // 通过 name 获取地址信息
  getByName(name: string): AddressInfo | undefined {
    return this.addressMap.get(name);
  }

  getHistroyByName(name: string): string[] | undefined {
    const address = this.addressMap.get(name);
    if (address) {
      return address.history;
    }
    return undefined;
  }

  getUrlByName(name: string, urlKey: string): [string | undefined, ChainCurrency] {
    const address = this.addressMap.get(name)
    if (!address) return [undefined, ChainCurrency.ETH];

    if (address.selfDomain && address.selfDomain !== "") {
      return [address.selfDomain, address.useLib]
    }
    const url = format(alchemyUrl, {
      domain: address.domain,
      key: urlKey,
    });
    return [url, address.useLib];
  }

  getLibByName(name: string): ChainCurrency {
    const address = this.addressMap.get(name)
    return address?.useLib || ChainCurrency.ETH;
  }

  // 获取所有地址
  getAll(): AddressInfo[] {
    return Array.from(this.addressMap.values());
  }

  async generateWallet(
    mnemonic: string,
    chain: ChainCurrency,
    index: number = 0
  ): Promise<{
    address: string;
    privateKey: string;
  }> {
    if (!bip39.validateMnemonic(mnemonic, wordlist)) {
      console.log('无效的助记词', mnemonic);
      throw new Error('无效的助记词');
    }

    const seed = await bip39.mnemonicToSeed(mnemonic);
    if (chain === ChainCurrency.SOLANA) {
      const seed32 = seed.slice(0, 32)
      const keypair = Keypair.fromSeed(seed32)
      const privateKeyHex = [...keypair.secretKey]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      return {
        address: keypair.publicKey.toBase58(),
        privateKey: privateKeyHex,
      }
    }

    if (chain === ChainCurrency.ETH) {
      // Ethereum 使用 BIP44 标准路径: m/44'/60'/index'/0/0
      const hdNode = ethers.HDNodeWallet.fromSeed(seed).derivePath(`m/44'/60'/${index}'/0/0`);
      return {
        address: hdNode.address,
        privateKey: hdNode.privateKey, // 0x 开头
      };
    }

    throw new Error(`不支持的链类型: ${chain}`);
  }
}

export const chainManager = new ChainManager([
  { name: ChainType.ETH, useLib: ChainCurrency.ETH, isTest: false, avatar: "/dogdog.png", domain: "eth-mainnet" },
  { name: ChainType.ETH_TEST, useLib: ChainCurrency.ETH, isTest: true, avatar: "/dogdog.png", domain: "eth-sepolia" },
  { name: ChainType.SOLANA, useLib: ChainCurrency.SOLANA, isTest: false, avatar: "/dogdog.png", domain: "solana-mainnet" },
  { name: ChainType.SOLANA_TEST, useLib: ChainCurrency.SOLANA, isTest: true, avatar: "/dogdog.png", domain: "solana-devnet" },
  { name: ChainType.BNB, useLib: ChainCurrency.ETH, isTest: false, avatar: "/dogdog.png", domain: "bnb-mainnet" },
  { name: ChainType.BNB_TEST, useLib: ChainCurrency.ETH, isTest: true, avatar: "/dogdog.png", domain: "bnb-testnet" }
]);