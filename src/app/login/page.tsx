'use client'
import { useState } from 'react'
import { ethers, HDNodeWallet } from 'ethers'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {useAuth} from '@context/auth';
export default function Login() {
 const [mnemonic, setMnemonic] = useState<string>('');
  const [wallet, setWallet] = useState<HDNodeWallet | null>(null);
  const [status, setStatus] = useState<string>('');


  const router = useRouter()
  const { login } = useAuth();
  
  const handleLogin = () => {
    try {
      const newWallet = ethers.Wallet.fromPhrase(mnemonic)
      setWallet(newWallet)
      // setStatus('钱包登录成功！')
      localStorage.setItem('wallet', newWallet.address) // 保存钱包地址到本地存储;

      login(newWallet.address); // 更新上下文中的钱包地址
      router.push('/');
    } catch (error) {
      console.error('登录失败:', error)
      setStatus('无效的助记词')
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">使用助记词登录</h2>

      <input
        type="text"
        placeholder="请输入助记词"
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
      >
        登录钱包
      </button>

      {status && <p className="text-center text-gray-500 mt-4">{status}</p>}
      
      <br />
      <br />
      <Link href="/register">
        <span className="text-black cursor-pointer hover:text-blue-800">
          没有钱包？申请一个
        </span>
      </Link>
      

      {/* <Link href="/register" className="hover:text-gray-300">注册</Link> */}
    </div>
  )
}
