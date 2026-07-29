declare module '@twreporter/errors' {
  type PrintOptions = {
    withPayload?: boolean
    withStack?: boolean
  }

  const errors: {
    helpers: {
      printAll: (
        error: Error,
        options?: PrintOptions,
        indent?: number,
        depth?: number
      ) => string
      wrap: (error: Error, name: string, message: string) => Error
    }
  }

  export default errors
}
