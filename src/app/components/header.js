import '../globals.css'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {useEffect, useState} from 'react'; 

import { isNotEmpty } from '@lib/utils';

import {useAuth} from '@context/auth';

import Logged from './logged';

export default function Header() {
  const router = useRouter();
  const { loggedWallet, login, shortWallet } = useAuth();  // 在这里调用 useAuth

  useEffect(() => {
    const storedWallet = localStorage.getItem('wallet');
    if (isNotEmpty(storedWallet)) {
      // 已登录，跳转到主页面
      login(storedWallet);
      router.push('/');
    } else {
      // 未登录，跳转到登录页面
      router.push('/login');
    }
  }, [router]);
  
  const [copySuccess, setCopySuccess] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(loggedWallet)

      setCopySuccess(true)
      // 3秒后恢复状态
      setTimeout(() => setCopySuccess(false), 1000)
    } catch (err) {
      setCopySuccess(false)
      console.error('复制失败:', err)
    }
  }

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
          <button onClick={handleCopy} className="font-mono"> {shortWallet()} </button>
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
