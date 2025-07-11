'use client'
import { useState } from 'react'
import { ethers, formatEther  } from 'ethers'

import {useAuth} from '@/context/auth';
import { addressManager } from '@/lib/address';
import ModalInput from '@/components/modalInput';

export default function Home() {
  const {loggedWallet, user, urlKey} = useAuth();
  const [balance, setBalance] = useState('')
  const [status, setStatus] = useState('')
  const getBalance = async () => {
    if (loggedWallet) {
      const url = addressManager.getUrlByName(user!.chain, urlKey)
      console.log("chain:", user?.chain, ", url:", url)
      const provider = new ethers.JsonRpcProvider(url)
      const balance = await provider.getBalance(loggedWallet.address)
      setBalance(formatEther(balance))
      setStatus('余额已加载')
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <ModalInput></ModalInput>
      <h2 className="text-3xl font-bold text-center mb-6">钱包信息</h2>

      {loggedWallet && (
        <div className="text-center">
          {/* <p>钱包地址：<span className="font-mono">{loggedWallet.address}</span></p> */}
          <button
            onClick={getBalance}
            className="mt-4 w-full py-2 rounded-md bg-[var(--btn)] hover-[var(--btn-hover)] text-[var(--btn-text)]"
          >
            获取余额
          </button>
        </div>
      )}

      {balance && (
        <div className="text-center text-gray-700 mt-4">
          <p>余额: {balance} ETH</p>
        </div>
      )}

      {status && <p className="text-center text-gray-500 mt-4">{status}</p>}
    </div>
  )
}
