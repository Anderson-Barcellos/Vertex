declare global {
  namespace NodeJS {
    interface Timeout extends ReturnType<typeof setTimeout> {
      [Symbol.dispose](): void
    }
    interface Timer extends ReturnType<typeof setInterval> {
      [Symbol.dispose](): void  
    }
  }
  
  type Timeout = NodeJS.Timeout
  type Timer = NodeJS.Timer
}

export {}