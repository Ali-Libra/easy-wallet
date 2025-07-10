'use client'
import { useState } from 'react'
import { ethers } from 'ethers'
import Link from 'next/link';

import {MnemonicDisplay} from '@/components/display'

export default function Register() {
  const [mnemonic, setMnemonic] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const createWallet = (): void => {
    const newWallet = ethers.Wallet.createRandom();
    const newMnemonic: string = newWallet.mnemonic?.phrase ?? '';
    setMnemonic(newMnemonic);
    setStatus('钱包已创建，点此登录');
  };


  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">创建一个新钱包</h2>

      <button
        onClick={createWallet}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 mb-6"
      >
        创建钱包
      </button>
      
      {mnemonic && (
        <div className="flex flex-col items-center justify-center mb-6">
          <p className="font-bold">助记词</p>
          <div className="mt-2" />
          <MnemonicDisplay mnemonic={mnemonic}/>
        </div>
      )}
          
      {status && 
      (<Link href={{pathname:"/login", query: {mnemonic: mnemonic}}}  className="w-full text-center text-gray-500 mt-4 block" >
            <span>{status}</span>
      </Link>)}
      {/* {status && <p className="text-center text-gray-500 mt-4">{status}</p>} */}
    </div>
  )
}
