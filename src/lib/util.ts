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

export const clickCopy = async (txt: string) => {
  try {
    await navigator.clipboard.writeText(txt)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

export function format(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return values[key] !== undefined ? values[key].toString() : `{${key}}`;
  });
}

export function hexToUint8Array(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) {
    throw new Error('Invalid hex string')
  }
  const arr = new Uint8Array(hexString.length / 2)
  for (let i = 0; i < hexString.length; i += 2) {
    arr[i / 2] = parseInt(hexString.substr(i, 2), 16)
  }
  return arr
}

export function insertWithLimit<T>(arr: T[], item: T, maxLen = 10): T[] {
  const index = arr.indexOf(item);
  if (index !== -1) {
    arr.splice(index, 1);
  }
  arr.unshift(item);
  if (arr.length > maxLen) {
    arr.pop(); // 超出长度移除最后一个
  }
  return arr;
}

export function setRootRem(designWidth = 375, baseFontSize = 16) {
  const html = document.documentElement;
  const updateFontSize = () => {
    const width = html.clientWidth;
    const scale = width / designWidth;

    const exponent = getExponent(scale);
    const adjustedScale = Math.pow(scale, exponent);
    console.log('exponent', exponent,' scale ', scale, ' adjustedScale', adjustedScale);
    html.style.fontSize = `${baseFontSize * adjustedScale}px`;
  };

  updateFontSize();
  window.addEventListener('resize', updateFontSize);
  window.addEventListener('orientationchange', updateFontSize);
}

function getExponent(scale: number): number {
  if (scale < 1.5) return 0.5;
  if (scale < 2) return 0.4;
  if (scale < 2.5) return 0.3;
  if (scale < 3) return 0.3;
  return 0.3;
}

interface IntervalTaskOptions {
  task: () => Promise<boolean> | boolean
  interval: number
  immediate?: boolean
  active?: boolean
  backoffFactor?: number
  maxInterval?: number
}

export interface IntervalTaskController {
  stop: () => void
  restart: () => void
}

export function startIntervalTask(options: IntervalTaskOptions): IntervalTaskController {
  const {
    task,
    interval,
    immediate = false,
    active = true,
    backoffFactor = 1.1,
    maxInterval = 60000,
  } = options

  let currentInterval = interval
  let cancelled = false
  let timer: ReturnType<typeof setTimeout> | null = null

  const run = async () => {
    const result = await Promise.resolve(task())

    if (cancelled) return

    if (result === false) {
      currentInterval = Math.min(currentInterval * backoffFactor, maxInterval)
    } else {
      currentInterval = interval
    }

    timer = setTimeout(run, currentInterval)
  }

  const start = () => {
    cancelled = false
    currentInterval = interval
    if (immediate) run()
    else timer = setTimeout(run, currentInterval)
  }

  const stop = () => {
    cancelled = true
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  if (active) start()

  return {
    stop,
    restart: () => {
      stop()
      start()
    },
  }
}
