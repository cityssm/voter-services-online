import cluster, { type Worker } from 'node:cluster'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Debug from 'debug'
import exitHook, { gracefulExit } from 'exit-hook'

import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from './debug.config.js'
import packageJson from './package.json' with { type: 'json' }

if (process.env.NODE_ENV === 'development') {
  Debug.enable(DEBUG_ENABLE_NAMESPACES)
}

const debug = Debug(`${DEBUG_NAMESPACE}:index`)

let isShuttingDown = false

function initializeCluster(): void {
  const directoryName = path.dirname(fileURLToPath(import.meta.url))

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const processCount = Math.min(4, os.cpus().length * 2)

  process.title = 'Voter Services Online (Primary)'

  debug(`Primary pid:   ${process.pid}`)
  debug(`Primary title: ${process.title}`)
  debug(`Version:       ${packageJson.version}`)
  debug(`Launching ${processCount} processes`)

  /*
   * Set up the cluster
   */

  const clusterSettings = {
    exec: `${directoryName}/app/appProcess.js`
  }

  cluster.setupPrimary(clusterSettings)

  const activeWorkers = new Map<number, Worker>()

  for (let index = 0; index < processCount; index += 1) {
    const worker = cluster.fork()

    const pid = worker.process.pid

    if (pid === undefined) {
      debug(
        'Forked worker without a valid PID; not adding to activeWorkers map'
      )

      continue
    }

    activeWorkers.set(pid, worker)
  }

  cluster.on('exit', (worker) => {
    const pid = worker.process.pid

    if (pid === undefined) {
      debug(
        'Worker with unknown PID has been killed; cannot update activeWorkers map'
      )
    } else {
      debug(`Worker ${pid.toString()} has been killed`)

      activeWorkers.delete(pid)
    }

    if (isShuttingDown) {
      return
    }

    debug('Starting another worker')
    const newWorker = cluster.fork()

    const newPid = newWorker.process.pid

    if (newPid === undefined) {
      debug(
        'Forked replacement worker without a valid PID; not adding to activeWorkers map'
      )

      return
    }

    activeWorkers.set(newPid, newWorker)
  })

  /*
   * Set up the exit hook
   */

  exitHook(() => {
    // eslint-disable-next-line unicorn/no-top-level-assignment-in-function
    isShuttingDown = true

    debug('Shutting down cluster workers...')

    for (const worker of activeWorkers.values()) {
      const pid = worker.process.pid

      debug(
        pid === undefined
          ? 'Killing worker with unknown PID'
          : `Killing worker ${pid}`
      )

      worker.kill()
    }
  })
}

function startApp(): void {
  /*
   * Start workers
   */

  initializeCluster()
}

startApp()

/*
 * Set up the startup test
 */

function handleSignal(signal: NodeJS.Signals): void {
  debug(`Received signal: ${signal}`)

  debug('Shutting down...')
  // eslint-disable-next-line unicorn/no-top-level-assignment-in-function
  isShuttingDown = true

  gracefulExit()
}

process.on('SIGINT', handleSignal)
process.on('SIGTERM', handleSignal)
process.on('SIGUSR2', handleSignal)
