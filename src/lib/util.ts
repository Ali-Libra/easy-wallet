export const isNotEmpty = (str : string | null): str is string => {
  return str !== null && str.trim() !== '';
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}


export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function tryRun<T>(fn: () => Promise<T> | T, maxAttempts = 3, delayMs = 1000, stopCondition: (result: T) => boolean): Promise<void> {
  for (let i = 1; i <= maxAttempts; i++) {
    const result = await fn()
    console.log(`第 ${i} 次执行结果:`, result)

    if (stopCondition(result)) {
      console.log('满足条件，提前结束')
      return
    }

    if (i < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }

  console.log('达到最大尝试次数，停止执行')
}

  export const clickCopy = async (txt:string) => {
    try {
      await navigator.clipboard.writeText(txt)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }