process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

function shutdown () {
  process.exit(0)
}
