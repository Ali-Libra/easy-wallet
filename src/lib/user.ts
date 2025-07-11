// src/lib/UserManager.ts

export type User = {
  mnemonic: string;
  name: string;
  chain: string;
};

export class UserManager {
  private cache: Record<string, User> = {};
  private readonly STORAGE_KEY = "users";

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    this.cache = raw ? JSON.parse(raw) : {};
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cache));
  }

  // 添加或更新用户
  saveUser(user: User) {
    this.cache[user.mnemonic] = user;
    this.saveToStorage();
  }

  // 获取单个用户
  getUserById(mnemonic: string): User | undefined {
    return this.cache[mnemonic];
  }

  // 获取全部用户
  getAllUsers(): Record<string, User> {
    return this.cache;
  }

  // 清空缓存和本地存储
  clearAll() {
    this.cache = {};
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const userManager = new UserManager();
