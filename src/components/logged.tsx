import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/context/auth';
import { userManager } from '@/lib/user';
import ModalInput from './modalInput';

export default function Logged() {
  //下拉选单逻辑
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const toggleDropdown = () => setExpanded((prev) => !prev);
  const hasMultipleUsers = userManager.size() > 1;
  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen)
  };

  // 点击区域外关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
        setExpanded(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])


  //退出按钮逻辑
  const navigate = useNavigate();
  const { logout } = useAuth()
  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('account');
    logout();
    navigate('/login');
  };

  const changeAccount = (account: string) => {
    localStorage.setItem('account', account);
    window.location.reload();
    // if (tryChangeAccount(account, login)) {
    //   // router.push('/');
    //   localStorage.setItem('account', account);
    //   window.location.reload();
    // } else {
    //   router.push("/login");
    // }
  };

  return (
    <div className="relative">
      <button ref={buttonRef} onClick={handleClick}
        className="w-12 h-12 rounded-full bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/dogdog.png)' }} // 替换成 public 目录下的图片路径
      ></button>

      {isMenuOpen && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2">
          <button
            onClick={toggleDropdown}
            className="text-base w-full text-center text-gray-700 hover:bg-gray-200 rounded p-1 font-semibold"
          >
            {user?.account || "未登录"}
            {hasMultipleUsers &&
              <span className="text-base text-gray-500">▾</span>}
          </button>
          {expanded && (
            Object.entries(userManager.getAllUsers())
              .filter(([_, user1]) => user1.account !== user?.account)
              .map(([key, user]) => (
                <button
                  key={key}
                  onClick={() => changeAccount(key)}
                  className="text-sm w-full text-center text-gray-700 hover:bg-gray-200 rounded p-1"
                >
                  {user.account}
                </button>
              ))
          )}


          <ModalInput></ModalInput>
          {user && (
            <button
              onClick={handleLogout}
              className="w-full text-center text-gray-700 hover:bg-gray-200 rounded p-1">
              退出
            </button>
          )}
        </div>
      )}
    </div>
  );
}