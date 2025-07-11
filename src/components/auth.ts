import { useAuth } from "@/context/auth";
import { User, userManager } from "@/lib/user";
import { isNotEmpty } from "@/lib/util";
import { HDNodeWallet } from "ethers";
import { ethers } from "ethers";
import { useRouter } from 'next/navigation';

/**
 * 尝试从 localStorage 自动登录
 * @param router Next.js router 实例（或自定义路由对象）
 * @param login 成功登录的回调 (user, wallet) => void
 * @returns 登录成功返回 true，失败返回 false
 */
export function tryChangeAccount(account:string | null,
    login: (user: User | undefined, wallet: HDNodeWallet) => User
) : boolean {
    const user = isNotEmpty(account) ? userManager.getUserById(account) : undefined;
    if (user) {
        try {
            const newWallet = ethers.Wallet.fromPhrase(user.mnemonic)
            login(user, newWallet)
            return true;
        } catch (error) {
            console.error('登录失败:', error)
        }
    }

    return false
}
