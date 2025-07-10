import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {useAuth } from '@/context/auth';

export default function Logged() {
  //下拉选单逻辑
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
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
  const router = useRouter();
  const { logout } = useAuth();
  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('wallet');
    logout();
    router.push('/login');
  };


  return (
    <div className="relative">
      <button ref={buttonRef} onClick={handleClick}
        className="w-12 h-12 rounded-full bg-cover bg-center"
        style={{ backgroundImage: 'url(/dogdog.png)' }} // 替换成 public 目录下的图片路径
      ></button>
      
      {isMenuOpen && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2">
          <button 
            onClick={handleLogout} 
            className="w-full text-center text-gray-700 hover:bg-gray-200 rounded p-1">
            退出
          </button>
        </div>
      )}
    </div>
  );
}
