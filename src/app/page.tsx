'use client'
import { useState } from 'react'
import { ethers } from 'ethers'

export default function Home() {
  const [wallet, setWallet] = useState(null)
  const [balance, setBalance] = useState(null)
  const [status, setStatus] = useState('')

  const getBalance = async () => {
    if (wallet) {
      const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID')
      const balance = await provider.getBalance(wallet.address)
      setBalance(ethers.utils.formatEther(balance))
      setStatus('余额已加载')
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">钱包信息</h2>

      {wallet && (
        <div className="text-center">
          <p>钱包地址：<span className="font-mono">{wallet.address}</span></p>
          <button
            onClick={getBalance}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
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
