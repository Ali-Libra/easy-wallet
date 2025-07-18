import { useState, useEffect } from 'react'
import { ethers, formatEther } from 'ethers'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import { useAuth } from '@/context/auth';
import { chainManager, ChainClass } from '@/lib/chain';
import ModalInput from '@/components/modalInput';
import { Erc20Info, erc20Manager } from '@/lib/erc20';

export default function Home() {
  const { wallet, user, urlKey } = useAuth();
  const [balance, setBalance] = useState('')
  const [status, setStatus] = useState('')
  const [currency, setCurrency] = useState("ETH")
  const [erc20InfoList, setErc20InfoList] = useState<Erc20Info[] | undefined>();

  useEffect(() => {
    if (!user) return;

    const infos = erc20Manager.getByName(user.chain);
    setErc20InfoList(infos);
  }, [user])
  const getBalance = async () => {
    if (!wallet || !user) {
      setStatus('请先登录钱包')
      return
    }

    if(urlKey == "") {
      alert("没有请求key")
      return;
    }
    const [url, chainClass, currency] = chainManager.getUrlByName(user.chain, urlKey)
    if (!url) {
      return
    }
    setCurrency(currency)
    console.log("chain:", user.chain, ", url:", url)

    if (chainClass == ChainClass.EVM) {
      const provider = new ethers.JsonRpcProvider(url)
      const balance = await provider.getBalance(wallet.address)
      setBalance(formatEther(balance))
      erc20Manager.getByName(user.chain)?.map((info) => {
        erc20Manager.getERC20Balance(info.address, wallet.address, provider).then((balance) => {
          info.value = balance
        })
      })
    } else if (chainClass == ChainClass.SOLANA) {
      const connection = new Connection(url, 'confirmed');
      const publicKey = new PublicKey(wallet.address);
      const balance = await connection.getBalance(publicKey);
      setBalance((balance / LAMPORTS_PER_SOL).toString())
      erc20Manager.getByName(user.chain)?.map((info) => {
        erc20Manager.getSPLTokenBalance(info.address, wallet.address, connection).then((balance) => {
          info.value = balance
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

      {balance && (
        <div className="text-base text-center text-gray-700 mt-4">
          <p>{balance} {currency}</p>
          {erc20InfoList?.map((info) => (
            <p key={info.name}>{info.value ?? 0.0} {info.name}</p>
          ))}
        </div>
      )}

      {status && <p className="text-center text-gray-500 mt-4">{status}</p>}
    </div>
  )
}
