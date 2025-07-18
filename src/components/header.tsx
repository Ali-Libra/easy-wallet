import '@/globals.css'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '@/context/auth';
import Logged from './logged';
import { chainManager, ChainType } from '@/lib/chain';
import { userManager } from '@/lib/user';
import { isNotEmpty } from '@/lib/util';

export default function Header() {
  const navigate = useNavigate();
  const { user, wallet, login, shortWallet } = useAuth();  // 在这里调用 useAuth
  const haveUser = userManager.size() > 0;

  useEffect(() => {
    const account = localStorage.getItem('account');
    const user = isNotEmpty(account) ? userManager.getUserById(account) : undefined;
    if (user) {
      const lib = chainManager.getLibByName(user.chain)
      chainManager.generateWallet(user.mnemonic, lib).then((wallet) => {
        login(user, user.mnemonic, wallet)
        navigate('/');
        return
      })
    }

    navigate("/login");
    chainManager.initSelfDomain();
    chainManager.initSendHistory();
  }, []);

  const [copySuccess, setCopySuccess] = useState('')
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet?.address || '')

      setCopySuccess('已复制')
      // 3秒后恢复状态
      setTimeout(() => setCopySuccess(''), 1000)
    } catch (err) {
      setCopySuccess('   ')
      console.error('复制失败:', err)
    }
  }

  const changeChain = (chain: string) => {
    if (user !== undefined) {
      user.chain = chain
      userManager.saveUser(user)

      console.log('changeChain ', user)
    }
    window.location.reload();
    // router.refresh();
  }
  // bg-gray-400
  return (
    <header className="px-6 py-2 text-[var(--text)] bg-[var(--header)] border-b border-gray-300">
      <div className="flex justify-between items-center">
        {/* 左侧 */}
        <div className="space-x-7 flex items-center">
          <Link to="/"><span className="cursor-pointer hover:text-indigo-300 text-base">钱包</span></Link>
          <Link to="/send"><span className="cursor-pointer hover:text-indigo-300 text-base">交易</span></Link>
        </div>
        {/* 中间 */}
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center space-x-2">
            <span className="font-mono text-base">{shortWallet()}</span>
            <button onClick={handleCopy}
              className="w-4 h-4 bg-cover bg-center"
              style={{ backgroundImage: `url(${!copySuccess ? '/assets/copy.png' : '/assets/copy_success.png'})` }}
            ></button>
          </div>
          <select
            className="py-1 px-1 inline-block w-auto bg-[var(--select)] text-black text-sm font-mono rounded-xl shadow-sm"
            value={user ? user.chain : ChainType.ETH}
            onChange={(e) => changeChain(e.target.value)}
          >
            {chainManager.getAll().map((address, idx) => (
              <option
                key={address.name || idx}
                value={address.name}
                className="text-black"
              >
                {address.name}
              </option>
            ))}
          </select>
        </div>
        {/* 右侧 */}
        <div>
          {haveUser ? (
            <Logged />
          ) : (
            <Link to="/login">
              <span className="cursor-pointer hover:text-indigo-300">登录</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
