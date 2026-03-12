// Tiny helper — simulates network latency in dev, instant in prod
export const delay = (ms = 200) =>
  process.env.NODE_ENV === 'development'
    ? new Promise((r) => setTimeout(r, ms))
    : Promise.resolve()
