export const logger = {
  info: (message: string) => {
    console.log(`[INFO] ${message}`)
  },
  log: (message: string | object) => {
    console.log('[LOG]', message)
  },
  warn: (message: string) => {
    console.log(`[WARN] ${message}`)
  },
  error: (message: string | object, error?: Error | any) => {
    console.log('[ERROR]', message)
    if (error) console.log(error)
  }
}