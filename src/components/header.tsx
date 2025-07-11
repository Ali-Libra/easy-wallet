import '@app/globals.css'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {useEffect, useState} from 'react'; 
import { ethers } from 'ethers'

import { isNotEmpty } from '@lib/util';
import {useAuth} from '@/context/auth';
import Logged from './logged';
import {addressManager} from '@/lib/address';

export default function Header() {
  const router = useRouter();
  const { loggedWallet, login, shortWallet, chain, setChain } = useAuth();  // 在这里调用 useAuth

  useEffect(() => {
    const mnemonic = localStorage.getItem('mnemonic');
    if (isNotEmpty(mnemonic)) {
        try {
          const newWallet = ethers.Wallet.fromPhrase(mnemonic)
          login(newWallet)
          localStorage.setItem('wallet', newWallet.address) // 保存钱包地址到本地存储;
          router.push('/');
          return;
        } catch (error) {
          console.error('登录失败:', error)
        }
    }
    // 未登录，跳转到登录页面
    router.push('/login');
  }, [router]);
  
  const [copySuccess, setCopySuccess] = useState('')
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(loggedWallet?.address|| '')

      setCopySuccess('已复制')
      // 3秒后恢复状态
      setTimeout(() => setCopySuccess(''), 1000)
    } catch (err) {
      setCopySuccess('   ')
      console.error('复制失败:', err)
    }
  }

  const changeChain = (chain: string) => {
    setChain(chain)
    router.refresh();
    // window.location.reload();
    // router.replace(window.location.pathname);
  }
// bg-gray-400
  return (
    <header className="bg-[var(--header)] text-[var(--text)] p-4 flex justify-between items-center">
      <div>
        {loggedWallet ? (
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
        {loggedWallet && (
          <div className="inline-flex items-center space-x-2">
            <span className="font-mono">
              {shortWallet()}
            </span>
            <button onClick={handleCopy}
              className="w-4 h-4 bg-cover bg-center"
              style={{ backgroundImage: `url(${!copySuccess ? '/copy_white.png' : '/copy_success_white.png'})` }}
            ></button>
            <select className=" text-white font-mono rounded-2xl px-0.5 py-0.5 ml-2"
              value={chain ? chain : 'ethereum'}
              onChange={(e) => changeChain(e.target.value)}
            >
              {addressManager.getAll().map((item, idx) => (
                <option
                  key={item.name || idx}
                  value={item.name}
                  className="bg-indigo-600 text-white rounded-2xl px-0.5 py-0.5"
                >
                  {item.name}
                </option>
              ))}
            </select>


          </div>

        )}

      </div>
      <div>
        {loggedWallet ? (
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
