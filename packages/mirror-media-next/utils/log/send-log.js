const sendLog = (log, target = '/api/tracking') => {
  const blob = new Blob([JSON.stringify(log)], {
    type: 'application/json; charset=UTF-8',
  })
  navigator.sendBeacon(target, blob)
}

export { sendLog }
