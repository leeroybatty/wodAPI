export const logger = {
    info: (message: string ) => {
      console.log(message)
    },
    log: (message: string ) => {
      console.log(message)
    },
    warn: (message: string ) => {
      console.log(message)
    },
    error: (message: string, error?: Error | any) => {
      console.log(message)
      if (error) console.log(error)
    }
}