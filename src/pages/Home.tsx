import { useState, useEffect } from 'react'
import { ethers, formatEther } from 'ethers'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import { useAuth } from '@/context/auth';
import { chainManager, ChainClass } from '@/lib/chain';
import ModalInput from '@/components/modalInput';
import { erc20Manager } from '@/lib/erc20';

export default function Home() {
  const { wallet, user, urlKey } = useAuth();
  const [status, setStatus] = useState('')
  const [currencyList, setCurrencyList] = useState<[string, string, string][]>([])

  // useEffect(() => {
  //   if (!user) return;

  // }, [user])
  const getBalance = async () => {
    if (!wallet || !user) {
      setStatus('请先登录钱包')
      return
    }

    if (urlKey == "") {
      alert("没有请求key")
      return;
    }
    const [url, chain] = chainManager.getUrlByName(user.chain, urlKey)
    if (!url || !chain) {
      return
    }
    console.log("chain:", user.chain, ", url:", url)

    setCurrencyList([])
    if (chain.useLib == ChainClass.EVM) {
      const provider = new ethers.JsonRpcProvider(url)
      const balance = await provider.getBalance(wallet.address)
      setCurrencyList(prevList => [...prevList, [chain.avatar, formatEther(balance), chain.currency]])
      erc20Manager.getByName(user.chain)?.map((info) => {
        erc20Manager.getERC20Balance(info.address, wallet.address, provider).then((balance) => {
          const avatar = erc20Manager.getAvatar(info.name)
          setCurrencyList(prevList => [...prevList, [avatar, balance, info.name]])
        })
      })
    } else if (chain.useLib == ChainClass.SOLANA) {
      const connection = new Connection(url, 'confirmed');
      const publicKey = new PublicKey(wallet.address);
      const balance = await connection.getBalance(publicKey);
      setCurrencyList(prevList => [...prevList, [chain.avatar, (balance / LAMPORTS_PER_SOL).toString(), chain.currency]])
      erc20Manager.getByName(user.chain)?.map((info) => {
        erc20Manager.getSPLTokenBalance(info.address, wallet.address, connection).then((balance) => {
          const avatar = erc20Manager.getAvatar(info.name)
          setCurrencyList(prevList => [...prevList, [avatar, balance, info.name]])
        })
      })
    } else {
      setStatus('未定义的币种')
      return
    }
    setStatus('余额已加载')
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <ModalInput showText={false}></ModalInput>
      {/* <h2 className="text-2xl font-bold text-center mb-6">钱包信息</h2> */}

      {user && (
        <div className="text-center">
          {/* <p>钱包地址：<span className="font-mono">{loggedWallet.address}</span></p> */}
          <button
            onClick={getBalance}
            className="mt-2 w-full py-2 rounded-md bg-[var(--btn)] hover-[var(--btn-hover)] text-[var(--btn-text)]"
          >
            获取余额
          </button>
        </div>
      )}

      {currencyList.length > 0 && (
        <div className="space-y-3 mt-4">
          {currencyList.map(([imgUrl, amount, name], index) => (
            <div key={`currency-${index}`} className="flex items-center justify-between max-w-[300px] mx-auto">
              <img src={imgUrl} alt={name} className="w-6 h-6 object-contain mr-2" />
              <p className="text-base text-gray-700  text-right">
                {amount ?? '0.0'} {name}
              </p>
            </div>
          ))}
        </div>
      )}

      {status && <p className="text-center text-gray-500 mt-4">{status}</p>}
    </div>
  )
}
