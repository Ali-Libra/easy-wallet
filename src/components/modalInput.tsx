'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';

type ModalInputProps = {
    open?: boolean;         // 外部控制是否显示弹窗
    defaultValues?: string[]; // 默认输入值（可选）
};

export default function ModalInput({ open = false, defaultValues = [] }: ModalInputProps) {
    const [show, setShow] = useState(open);
    const [inputs, setInputs] = useState<string[]>(defaultValues.length === 3 ? defaultValues : ["", "", ""]);
    const {setUrlKey} = useAuth()

    useEffect(() => {
        const alchemyKey = localStorage.getItem("alchemy");
        if (alchemyKey) {
            setUrlKey(alchemyKey)
            setShow(false)
            return
        }
        
        setShow(true); // 当外部 open 变化时，更新显示状态
    }, [open]);

    const titles = ["alchemy"];

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    };

    const handleConfirm = (index: number) => {
        console.log("Confirmed:", inputs[index]);
        console.log("index", index)
        if (index === 0) {
            localStorage.setItem("alchemy", inputs[index]);
        } else {
            return
        }
        setUrlKey(inputs[index])
    };

    return (
        <div className="p-4">
            {/* 可选：点击按钮手动打开 */}
            <button
                onClick={() => setShow(true)}
                className="w-full text-center text-gray-700 hover:bg-gray-200 rounded p-1"
            >
                编辑地址
            </button>

            {show && (
                <div className="fixed inset-0 bg-gray-300/25 backdrop-blur-sm flex justify-center items-start pt-20 z-50">
                    <div className="relative bg-white rounded-lg shadow-lg p-6 w-108 h-40">
                        {/* 右上角关闭按钮 */}
                        <button
                            onClick={() => setShow(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                            aria-label="关闭弹窗"
                        >
                            ×
                        </button>
                        <div className="mt-5" />

                        {titles.map((title, index) => (
                            <div key={index} className="flex items-center justify-center mb-4 gap-2">
                                <div className="w-18 text-black">{title}</div>
                                <input
                                    value={inputs[index]}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    className="w-56 border border-gray-300 rounded px-2 py-1 text-black placeholder-[var(--text-notice)"
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
                    </div>
                </div>

            )}
        </div>
    );
}
