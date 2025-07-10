import '@app/globals.css'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {useEffect, useState} from 'react'; 
import { ethers } from 'ethers'

import { isNotEmpty } from '@lib/util';

import {useAuth} from '@/context/auth';

import Logged from './logged';

export default function Header() {
  const router = useRouter();
  const { loggedWallet, login, shortWallet } = useAuth();  // 在这里调用 useAuth

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
// bg-gray-400
  return (
    <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
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

      <div className="flex-1 flex justify-center">
        {loggedWallet && (
          <div className="inline-flex items-center space-x-2">
            <span className="font-mono">
              {shortWallet()}
            </span>
            <button onClick={handleCopy}
              className="w-4 h-4 bg-cover bg-center"
              style={{backgroundImage: `url(${!copySuccess ? '/copy_white.png' : '/copy_success_white.png'})` }} // 替换成 public 目录下的图片路径
            ></button>
            {/* {copySuccess && (
              <span className="text-xs">
                {copySuccess}
              </span>
            )} */}
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
