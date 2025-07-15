import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MnemonicInput } from '@/components/display'
import { useAuth } from '@/context/auth'
import { chainManager, ChainCurrency } from '@/lib/chain'

export default function Login() {
  const [mnemonic, setMnemonic] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [mnemonicParam, setMnemonicParam] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  // 用 useEffect 读取 URL 查询参数，保证 window 对象存在
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setMnemonicParam(params.get('mnemonic'))
  }, [])

  const handleLogin = () => {
    try {
      let nickName = ''
      if (inputRef.current) {
        nickName = inputRef.current.value
      }
      const realMnemonic = mnemonicParam ? mnemonicParam : mnemonic
      chainManager.generateWallet(realMnemonic, ChainCurrency.ETH).then((wallet) => {
        const user = login(undefined, realMnemonic, wallet, nickName)
        localStorage.setItem('account', user.account)
        navigate('/')
      })
    } catch (error) {
      console.error('登录失败:', error)
      setStatus('无效的助记词')
    }
  }

  const handleMnemonicChange = (words: string) => {
    setMnemonic(words)
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">使用助记词登录</h2>
      <MnemonicInput
        count={12}
        {...(mnemonicParam ? { initialValues: mnemonicParam } : undefined)}
        onChange={handleMnemonicChange}
      />
      <div className="mt-4" />

      <button
        onClick={handleLogin}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
      >
        登录钱包
      </button>

      {status && <p className="text-center text-gray-500 mt-4">{status}</p>}

      <br />
      <br />
      <Link to="/register">
        <span className="text-black cursor-pointer hover:text-blue-800">没有钱包？申请一个</span>
      </Link>
    </div>
  )
}
