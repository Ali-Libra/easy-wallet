'use client'
import { useState } from 'react'
import { ethers } from 'ethers'

export default function SendTransaction() {
  const [toAddress, setToAddress] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [status, setStatus] = useState('')
  const loggedWallet = localStorage.getItem('wallet');
  const sendTransaction = async () => {
    if (!loggedWallet || !toAddress || !sendAmount) {
      setStatus('请确保输入所有字段')
      return
    }

    try {
      const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID')
      const tx = {
        to: toAddress,
        value: ethers.utils.parseEther(sendAmount),
      }

      const signer = provider.getSigner(loggedWallet)
      const transaction = await signer.sendTransaction(tx)
      setStatus(`交易已发送！交易哈希: ${transaction.hash}`)
    } catch (error) {
      setStatus(`发送失败：${error.message}`)
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">发送</h2>

      <input
        type="text"
        placeholder="收款地址"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
      />

      <input
        type="text"
        placeholder="金额 (ETH)"
        value={sendAmount}
        onChange={(e) => setSendAmount(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
      />

      <button
        onClick={sendTransaction}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        发送
      </button>

      {status && <p className="text-center text-gray-500 mt-4">{status}</p>}
    </div>
  )
}
