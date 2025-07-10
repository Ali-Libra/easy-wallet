'use client'
import { useState } from 'react'
import { ethers, HDNodeWallet } from 'ethers'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MnemonicInput } from '@/components/display';

import {useAuth} from '@/context/auth';
export default function Login() {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const {login} = useAuth();

  const router = useRouter()
  const searchParams = useSearchParams()
  const mnemonicParam = searchParams.get('mnemonic')
  
  const handleLogin = () => {
    try {
      const realMnemonic = mnemonicParam?mnemonicParam:mnemonic
      const newWallet = ethers.Wallet.fromPhrase(realMnemonic)
      login(newWallet)
      localStorage.setItem('mnemonic', realMnemonic) // 保存钱包地址到本地存储;
      router.push('/');
    } catch (error) {
      console.error('登录失败:', error)
      setStatus('无效的助记词')
    }
  }

  const handleMnemonicChange = (words: string) => {
    console.log('handleMnemonicChange', words)
    setMnemonic(words)
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">使用助记词登录</h2>
      <MnemonicInput count={12} 
        {...(mnemonicParam ? { initialValues: mnemonicParam } : undefined)}
        onChange={handleMnemonicChange}/>
      <div className="mt-4" />

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
