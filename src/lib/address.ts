import { format } from "@lib/util";

// 定义一个地址信息结构体
export type AddressInfo = {
  avatar: string; // 头像
  name: string;
  domain: string;
  isTest: boolean;
  selfDomain?: string;
};

let alchemyUrl = "https://{domain}.g.alchemy.com/v2/{key}"

// 地址管理器类
class AddressManager {
  private addressMap: Map<string, AddressInfo>;

  constructor(initialData?: AddressInfo[]) {
    this.addressMap = new Map();

    // 初始化数据
    if (initialData) {
      for (const item of initialData) {
        const saveDomain = localStorage.getItem("address:" + item.name)
        if (saveDomain) {
          item.selfDomain = saveDomain
        }
        this.addressMap.set(item.name, item);
      }
    }
  }

  // 添加地址
  addAddress(info: AddressInfo) {
    this.addressMap.set(info.name, info);
  }

  // 通过 name 获取地址信息
  getByName(name: string): AddressInfo | undefined {
    return this.addressMap.get(name);
  }

  getUrlByName(name: string, urlKey: string): string | undefined {
    const address = this.addressMap.get(name)
    if (!address) return;
    if (address.selfDomain) {
      return address.selfDomain
    }
    const url = format(alchemyUrl, {
      domain: address.domain,
      key: urlKey,
    });
    console.log("getUrlByName:",url)
    return url;
  }

  // 获取所有地址
  getAll(): AddressInfo[] {
    return Array.from(this.addressMap.values());
  }
}

export const addressManager = new AddressManager([
  { name: "Ethereum", isTest: false, avatar: "/dogdog.png", domain: "eth-mainnet" },
  { name: "Sepolia", isTest: true, avatar: "/dogdog.png", domain: "eth-sepolia" },
  { name: "Solana", isTest: false, avatar: "/dogdog.png", domain: "solana-mainnet" },
  { name: "Solana-dev", isTest: true, avatar: "/dogdog.png", domain: "solana-devnet" },
  { name: "BNB", isTest: false, avatar: "/dogdog.png", domain: "bnb-mainnet" },
  { name: "BNB-test", isTest: true, avatar: "/dogdog.png", domain: "bnb-testnet"}
]);