'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { addressManager } from '@/lib/address';

type ModalInputProps = {
    showText?: boolean;         // 外部控制是否显示弹窗
    defaultValues?: string[]; // 默认输入值（可选）
};

export default function ModalInput({ showText = true}: ModalInputProps) {
    const [show, setShow] = useState(false);
    const [inputs, setInputs] = useState<string[]>([]);
    const {setUrlKey} = useAuth()

    const titles = ["alchemy"];
    useEffect(() => {
        setShow(true); // 当外部 open 变化时，更新显示状态

        const addressList = addressManager.getAll();
        const totalLength = titles.length + addressList.length;
        const newInputs: string[] = Array(totalLength).fill("");

        titles.forEach((title, index) => {
            const key = localStorage.getItem(title);
            if (key) {
                setUrlKey(key)
                newInputs[index] = key;
                setShow(false)
            }
        });
        addressList.forEach((address, index) => {
            if(address.selfDomain) {
                newInputs[titles.length+index] = address.selfDomain;
                setShow(false)
            }
        });

        setInputs(newInputs);
    }, []);


    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    };

    const handleConfirm = (index: number) => {
        if(inputs[index] === "") return;
        localStorage.setItem(titles[index], inputs[index]);
        setUrlKey(inputs[index])
    };

    const handleConfirmSelfDomain = (index: number, name: string) => {
        addressManager.setSelfDomain(name, inputs[index])
    };

    return (
        <div className="p-1">
            {/* 可选：点击按钮手动打开 */}
            {showText&&<button
                onClick={() => setShow(true)}
                className="w-full text-center text-gray-700 hover:bg-gray-200 rounded p-1"
            >
                编辑地址
            </button>}

            {show && (
                <div className="fixed inset-0 bg-gray-300/25 backdrop-blur-sm flex justify-center items-start pt-20 z-50">
                    <div className="relative bg-white rounded-lg shadow-lg p-6 w-[32rem] max-h-[60vh] overflow-y-auto">
                        {/* 右上角关闭按钮 */}
                        <button
                            onClick={() => setShow(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                            aria-label="关闭弹窗"
                        >
                            ×
                        </button>
                        <div className="mt-5" />

                        {/* 设置访问ID */}
                        {titles.map((title, index) => (
                            <div key={index} className="flex items-center justify-center mb-4 gap-2">
                                <div className="w-18 text-black">{title}</div>
                                <input
                                    value={inputs[index]}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    className="w-72 text-sm border border-gray-300 rounded px-2 py-1 text-black placeholder-[var(--text-notice)"
                                    placeholder={`${title}的ID`}
                                />
                                <div className="mt-0.5" />
                                <button
                                    onClick={() => handleConfirm(index)}
                                    className="px-3 py-1 rounded bg-[var(--btn)] hover-[var(--btn-hover)] text-[var(--btn-text)]"
                                >
                                    确认
                                </button>
                            </div>
                        ))}
                        <h2 className="text-center mb-4 text-black text-lg font-semibold">
                            自定义访问域名
                        </h2>
                        {/* 设置自定义访问域名 */}
                        {addressManager.getAll().map((address, index) => (
                            <div key={index} className="flex items-center justify-center mb-4 gap-2">
                                <div className="w-18 text-black">{address.name}</div>
                                <input
                                    value={inputs[titles.length+index]}
                                    onChange={(e) => handleInputChange(titles.length+index, e.target.value)}
                                    className="w-72 text-sm border border-gray-300 rounded px-2 py-1 text-black"
                                />
                                <div className="mt-0.5" />
                                <button
                                    onClick={() => handleConfirmSelfDomain(titles.length+index, address.name)}
                                    className="px-3 py-1 rounded bg-[var(--btn)] hover-[var(--btn-hover)] text-[var(--btn-text)]"
                                >
                                    确认
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
