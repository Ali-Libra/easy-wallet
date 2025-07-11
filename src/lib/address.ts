// 定义一个地址信息结构体
export type AddressInfo = {
  avatar: string;
  name: string;
  domain: string;
};

// 地址管理器类
class AddressManager {
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

  // 添加地址
  addAddress(info: AddressInfo) {
    this.addressMap.set(info.name, info);
  }

  // 通过 name 获取地址信息
  getByName(name: string): AddressInfo | undefined {
    return this.addressMap.get(name);
  }

  // 获取所有地址
  getAll(): AddressInfo[] {
    return Array.from(this.addressMap.values());
  }
}

export const addressManager = new AddressManager([
  { name: "ethereum", avatar: "/dogdog.png", domain: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID" },
  { name: "sepolia", avatar: "/dogdog.png", domain: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID" }
]);