'use client'
import { useState } from 'react'
import { ethers, formatEther  } from 'ethers'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

import {useAuth} from '@/context/auth';
import { addressManager, ChainCurrency } from '@/lib/address';
import ModalInput from '@/components/modalInput';

export default function Home() {
  const {address, user, urlKey} = useAuth();
  const [balance, setBalance] = useState('')
  const [status, setStatus] = useState('')
  const [currency, setCurrency ] = useState(ChainCurrency.ETH)

  const getBalance = async () => {
    if (!address) {
      setStatus('请先登录钱包')
      return
    }
    const [url, curr] = addressManager.getUrlByName(user!.chain, urlKey)
    if(!url) {
      return
    }
    setCurrency(curr)
    console.log("chain:", user?.chain, ", url:", url)

    if(curr == ChainCurrency.ETH) {
      const provider = new ethers.JsonRpcProvider(url)
      const balance = await provider.getBalance(address)
      setBalance(formatEther(balance))
    } else if(curr == ChainCurrency.SOLANA) {
      const connection = new Connection(url, 'confirmed');
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      setBalance((balance / 1_000_000_000).toString())
    } else {
      setStatus('未定义的币种')
      return
    }
    setStatus('余额已加载')
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <ModalInput showText={false}></ModalInput>
      <h2 className="text-3xl font-bold text-center mb-6">钱包信息</h2>

      {user && (
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
          <p>余额: {balance} {currency}</p>
        </div>
      )}

      {status && <p className="text-center text-gray-500 mt-4">{status}</p>}
    </div>
  )
}
