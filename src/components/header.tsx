import '@app/globals.css'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {useEffect, useState} from 'react'; 

import {useAuth} from '@/context/auth';
import Logged from './logged';
import {chainManager, ChainType} from '@/lib/chain';
import { userManager } from '@/lib/user';
import { isNotEmpty } from '@/lib/util';
import { ethers } from "ethers";

export default function Header() {
  const router = useRouter();
  const { user, wallet, login, shortWallet } = useAuth();  // 在这里调用 useAuth
  const haveUser = userManager.size() > 0;

  useEffect(() => {
    const account = localStorage.getItem('account');
    const user = isNotEmpty(account) ? userManager.getUserById(account) : undefined;
    if(user) {
      const lib = chainManager.getLibByName(user.chain)
      chainManager.generateWallet(user.mnemonic, lib).then((wallet) =>{
        login(user, user.mnemonic, wallet)
        router.push('/');
        return
      })
    }

    router.push("/login");
    chainManager.initSelfDomain();
    chainManager.initSendHistory();
  }, []);
  
  const [copySuccess, setCopySuccess] = useState('')
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet?.address || '')

      setCopySuccess('已复制')
      // 3秒后恢复状态
      setTimeout(() => setCopySuccess(''), 1000)
    } catch (err) {
      setCopySuccess('   ')
      console.error('复制失败:', err)
    }
  }

  const changeChain = (chain: string) => {
    if(user !== undefined) {
      user.chain = chain
      userManager.saveUser(user)
      
      console.log('changeChain ', user)
    }
    window.location.reload();
    // router.refresh();
  }
// bg-gray-400
  return (
    <header className="bg-[var(--header)] text-[var(--text)] p-4 flex justify-between items-center">
      <div>
        {user ? (
          <div className="flex items-center space-x-6">
            <div className="flex space-x-6">
              <Link href="/">
                <span className="cursor-pointer hover:text-indigo-300">钱包</span>
              </Link>
              <Link href="/send">
                <span className="cursor-pointer hover:text-indigo-300">交易</span>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
      <div>
        {user && (
          <div className="inline-flex items-center space-x-2">
            <span className="font-mono">
              {shortWallet()}
            </span>
            <button onClick={handleCopy}
              className="w-4 h-4 bg-cover bg-center"
              style={{ backgroundImage: `url(${!copySuccess ? '/copy_white.png' : '/copy_success_white.png'})` }}
            ></button>
            <select className=" text-white font-mono rounded-2xl px-0.5 py-0.5 ml-2"
              value={user ? user.chain : ChainType.ETH}
              onChange={(e) => changeChain(e.target.value)}
            >
              {chainManager.getAll().map((address, idx) => (
                <option
                  key={address.name || idx}
                  value={address.name}
                  className="bg-indigo-600 text-white rounded-2xl px-0.5 py-0.5"
                >
                  {address.name}
                </option>
              ))}
            </select>


          </div>

        )}

      </div>
      <div>
        {haveUser ? (
          <Logged />
        ) : (
          <Link href="/login">
            <span className="cursor-pointer hover:text-indigo-300">登录</span>
          </Link>
        )}
      </div>
    </header>
  );
}
