// src/lib/UserManager.ts

export type User = {
    account: string;
    mnemonic: string;
    chain: string;
};

export class UserManager {
    private loaded = false;
    private cache: Record<string, User> = {};
    private readonly STORAGE_KEY = "users";

    constructor() {

    }

    private ensureLoaded() {
        if (!this.loaded) {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            this.cache = raw ? JSON.parse(raw) : {};
            this.loaded = true;
        }
    }
    private saveToStorage() {
        this.ensureLoaded();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cache));
    }

    // 添加或更新用户
    saveUser(user: User) {
        this.ensureLoaded();
        this.cache[user.account] = user;
        this.saveToStorage();
    }

    // 获取单个用户
    getUserById(account: string): User | undefined {
        this.ensureLoaded();
        return this.cache[account];
    }

    // 获取全部用户
    getAllUsers(): Record<string, User> {
        this.ensureLoaded();
        return this.cache;
    }

    size(): number {
        return Object.keys(this.cache).length;
    }

    // 清空缓存和本地存储
    clearAll() {
        this.cache = {};
        localStorage.removeItem(this.STORAGE_KEY);
    }
}

export const userManager = new UserManager();
