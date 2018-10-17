const Docker = require('dockerode')
const docker = new Docker({ socketPath: '/var/run/docker.sock' })
const ai = require('applicationinsights')
require('./shutdown')

const { AI_KEY: key, AI_LOGGER: logger } = process.env

if (!key) throw new TypeError('missing AI_KEY')
if (!logger) throw new TypeError('missing AI_LOGGER')

ai.setup(key).start()

const client = ai.defaultClient

client.commonProperties = {
  LoggerName: logger
}

async function collect () {
  collect.since = collect.since || {}
  const containers = await docker.listContainers()

  while (true) {
    for (const containerInfo of containers) {
      const { Id: id, Names: names } = containerInfo
      if (!collect.since[id]) {
        collect.since[id] = Date.now() - 60000
      }

      if (
        !containerInfo.Image.includes('jameskyburz/docker-appinsights-logger')
      ) {
        const since = collect.since[id] / 1000
        const name = names[0]
        const container = docker.getContainer(id)

        const logs = await container.logs({
          stdout: true,
          stderr: true,
          timestamps: true,
          since
        })

        for (const log of logs.split('\n')) {
          const message = log
            .toString()
            .replace(/^[\D]+/g, '')
            .trim()
          if (!message) continue
          client.trackTrace({
            message,
            properties: { id, name }
          })
        }

        const { cpu_stats: cpu, memory_stats: memory } = await container.stats({
          stream: false
        })
        client.trackMetric({
          name: 'cpu usage',
          value: cpu.cpu_usage.total_usage,
          properties: { name, id }
        })
        client.trackMetric({
          name: 'memory %',
          value: memory.usage / memory.limit * 100,
          properties: { name, id }
        })
      }
      collect.since[id] = Date.now()
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 45000))
  }
}

collect().catch(err => {
  console.error(err)
  setTimeout(() => process.exit(1), 3000)
})
