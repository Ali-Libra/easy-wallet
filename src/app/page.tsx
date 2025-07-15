'use client'
import { useState } from 'react'
import { ethers, formatEther } from 'ethers'
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from '@solana/web3.js';

import { useAuth } from '@/context/auth';
import { chainManager, ChainCurrency } from '@/lib/chain';
import ModalInput from '@/components/modalInput';
import { erc20Manager } from '@/lib/erc20';

export default function Home() {
  const { wallet, user, urlKey } = useAuth();
  const [balance, setBalance] = useState('')
  const [status, setStatus] = useState('')
  const [currency, setCurrency] = useState(ChainCurrency.ETH)

  const getBalance = async () => {
    if (!wallet || !user) {
      setStatus('请先登录钱包')
      return
    }
    const [url, curr] = chainManager.getUrlByName(user.chain, urlKey)
    if (!url) {
      return
    }
    setCurrency(curr)
    console.log("chain:", user.chain, ", url:", url)

    if (curr == ChainCurrency.ETH) {
      const provider = new ethers.JsonRpcProvider(url)
      const balance = await provider.getBalance(wallet.address)
      setBalance(formatEther(balance))
      erc20Manager.getByName(user.chain)?.map((info) => { 
        erc20Manager.getERC20Balance(info.address, wallet.address, provider).then((balance) => {
          info.value = balance
        })
      })
    } else if (curr == ChainCurrency.SOLANA) {
      const connection = new Connection(url, 'confirmed');
      const publicKey = new PublicKey(wallet.address);
      const balance = await connection.getBalance(publicKey);
      setBalance((balance / LAMPORTS_PER_SOL).toString())
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
          <p>{balance} {currency}</p>
          {erc20Manager.getByName(user!.chain)?.map((info) => (
            info.value ? <p>{info.value} {info.name}</p> : null
          ))}
        </div>
      )}

      {status && <p className="text-center text-gray-500 mt-4">{status}</p>}
    </div>
  )
}
