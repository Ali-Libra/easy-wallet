import { useState, useEffect, useRef } from 'react'
import { ethers, formatEther } from 'ethers'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

import { useAuth } from '@/context/auth'
import { chainManager, ChainClass } from '@/lib/chain'
import ModalInput from '@/components/modalInput'
import { erc20Manager } from '@/lib/erc20'
import { startIntervalTask } from '@/lib/util'

export default function Home() {
  const { wallet, user, urlKey } = useAuth()
  const [status, setStatus] = useState('')
  const [currencyMap, setCurrencyMap] = useState<Record<string, { icon: string; amount: string }>>({})

  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!user || hasInitialized.current) return
    hasInitialized.current = true

    const controller = startIntervalTask({
      task: async () => {
        return getBalance()
      },
      interval: 5000,
      immediate: true,
      backoffFactor: 2,
    })
    return () => {
      controller.stop()
      hasInitialized.current = false
    }
  }, [user])

  // let count = 0;
  const getBalance = async (): Promise<boolean> => {
    if (!wallet || !user) {
      setStatus('请先登录钱包')
      return false
    }

    if (urlKey === '') {
      alert('没有请求key')
      return false
    }

    const [url, chain] = chainManager.getUrlByName(user.chain, urlKey)
    if (!url || !chain) return false

    console.log("更新余额")
    // count++;
    try {
      const newMap: typeof currencyMap = {}

      if (chain.useLib === ChainClass.EVM) {
        const provider = new ethers.JsonRpcProvider(url)
        const balance = await provider.getBalance(wallet.address)
        newMap[chain.currency] = {
          icon: chain.avatar,
          amount: formatEther(balance),
          // amount: formatEther(balance + BigInt(count)),
        }

        const erc20List = erc20Manager.getByName(user.chain) || []
        for (const info of erc20List) {
          const bal = await erc20Manager.getERC20Balance(info.address, wallet.address, provider)
          newMap[info.name] = {
            icon: erc20Manager.getAvatar(info.name),
            amount: bal,
          }
        }
      } else if (chain.useLib === ChainClass.SOLANA) {
        const connection = new Connection(url, 'confirmed')
        const publicKey = new PublicKey(wallet.address)
        const balance = await connection.getBalance(publicKey)
        newMap[chain.currency] = {
          icon: chain.avatar,
          amount: (balance / LAMPORTS_PER_SOL).toString(),
        }

        const splList = erc20Manager.getByName(user.chain) || []
        for (const info of splList) {
          const bal = await erc20Manager.getSPLTokenBalance(info.address, wallet.address, connection)
          newMap[info.name] = {
            icon: erc20Manager.getAvatar(info.name),
            amount: bal,
          }
        }
      } else {
        setStatus('未定义的币种')
        return false
      }

      // setCurrencyMap((prev) => ({ ...prev, ...newMap }))
      let hasChanged = false

      setCurrencyMap((prev) => {
        for (const key in newMap) {
          if (
            !prev[key] ||
            prev[key].amount !== newMap[key].amount // 余额变化
          ) {
            hasChanged = true
            break
          }
        }
        if (!hasChanged) {
          return prev
        }
        return { ...prev, ...newMap }
      })

      //数据未变化也得提示下更新
      setStatus('数据已更新')
      setTimeout(() => {
        setStatus('')
      }, 1500)

      if (!hasChanged) {
        console.log('数据未变化')
        return false
      }
      return true
    } catch (e) {
      console.error('获取余额失败', e)
      setStatus('获取余额失败')
      return false
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 pt-1.5 rounded-lg shadow-lg h-[400px] overflow-y-auto">
      <ModalInput showText={false} showModal={false} />
      {/* 币种展示 */}
      {Object.entries(currencyMap).length > 0 && (
        <div className="space-y-3 mt-4">
          {Object.entries(currencyMap).map(([name, { icon, amount }]) => (
            <div key={name} className="flex items-center justify-between max-w-[330px] mx-auto">
              <img src={icon} alt={name} className="w-6 h-6 object-contain mr-2" />
              <p className="text-base text-gray-700 text-right">
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
