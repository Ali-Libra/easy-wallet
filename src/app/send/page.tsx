'use client'
import { useState } from 'react'
import { ethers } from 'ethers'
import { useAuth } from '@/context/auth';
import { addressManager } from '@/lib/address';

export default function SendTransaction() {
  const [toAddress, setToAddress] = useState<string>('');
  const [sendAmount, setSendAmount] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const {user, urlKey} = useAuth()

  const loggedWallet = typeof window !== 'undefined' ? localStorage.getItem('wallet') : null;

  const sendTransaction = async () => {
    if (!loggedWallet || !toAddress || !sendAmount) {
      setStatus('请确保输入所有字段')
      return
    }

    try {
      const url = addressManager.getUrlByName(user!.chain, urlKey)
      const provider = new ethers.JsonRpcProvider(url);
      setStatus('⚠️ 无法使用 provider.getSigner(address)。请使用连接钱包或私钥创建 signer。');
      // return;

      // const tx = {
      //   to: toAddress,
      //   value: ethers.parseEther(sendAmount), // ethers v6 写法，不是 utils.parseEther
      // };

      // const transaction = await signer.sendTransaction(tx);
      // setStatus(`交易已发送！交易哈希: ${transaction.hash}`);
    } catch (error: any) {
      setStatus(`发送失败：${error.message}`);
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
