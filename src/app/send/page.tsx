'use client'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useAuth } from '@/context/auth';
import { addressManager, ChainCurrency } from '@/lib/address';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import { hexToUint8Array } from '@/lib/util';

export default function SendTransaction() {
  const [toAddress, setToAddress] = useState<string>('');
  const [sendAmount, setSendAmount] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const { user, wallet, urlKey } = useAuth()
  const [sending, setSending] = useState(false)
  const [history, setHistory] = useState<string[] | undefined>(undefined)

  useEffect(() => {
    if (!user) {
      return
    }
    const oldHistory = addressManager.getHistroyByName(user.chain)
    setHistory(oldHistory)
  })

  const sendTransaction = async () => {
    if (sending) {
      alert('正在发送中，请勿重复点击')
      return
    }

    if (!toAddress || !sendAmount) {
      setStatus('请确保输入所有字段')
      return
    }

    if (!user || !wallet) {
      setStatus('请先登录钱包')
      return
    }

    const [url, currency] = addressManager.getUrlByName(user.chain, urlKey)
    if (!url) {
      setStatus('请先登录钱包')
      return
    }
    try {
      setSending(true)
      if (currency == ChainCurrency.ETH) {
        const provider = new ethers.JsonRpcProvider(url);
        const newWallet = new ethers.Wallet(wallet.privateKey, provider)
        const tx = {
          to: toAddress,
          value: ethers.parseEther(sendAmount),
        };
        const transaction = await newWallet.sendTransaction(tx)
        await transaction.wait()
        setStatus(`交易已发送！交易哈希: ${transaction.hash}`);
      } else if (currency == ChainCurrency.SOLANA) {
        const connection = new Connection(url, 'confirmed')
        const from = Keypair.fromSecretKey(hexToUint8Array(wallet.privateKey))
        const to = new PublicKey(toAddress)

        const tx = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to,
            lamports: Number(sendAmount) * LAMPORTS_PER_SOL,
          })
        )

        const signature = await sendAndConfirmTransaction(connection, tx, [from])
        setStatus(`交易已发送！交易哈希: ${signature}`);
      } else {
        setStatus('暂不支持此链')
        return
      }

      setSending(false)
      addressManager.addSendHistory(user.chain, toAddress)
      setHistory(addressManager.getHistroyByName(user.chain))
    } catch (error: any) {
      setStatus(`发送失败：${error.message}`);
      setSending(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">发送</h2>

      <input
        list="history-addresses"
        type="text"
        placeholder="收款地址"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
      />
      {history && (
        <datalist id="history-addresses">
          {history.map((item, index) => (
            <option key={index} value={item} />
          ))}
        </datalist>
      )}

      <input
        type="text"
        placeholder="金额"
        value={sendAmount}
        onChange={(e) => setSendAmount(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
      />

      <button
        onClick={sendTransaction}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        {sending ? '发送中' : '发送'}
      </button>

      {status && <p className="text-center text-gray-500 mt-4">{status}</p>}
    </div>
  )
}
