module.exports = shipit => {
  require('shipit-deploy')(shipit)

  const PM2_APP_NAME = 'linkdrop-server'

  shipit.initConfig({
    default: {
      deployTo: 'linkdrop/linkdrop-monorepo',
      repositoryUrl: 'git@github.com:LinkdropProtocol/linkdrop-monorepo.git',
      keepReleases: 3
    },
    dev: {
      servers: 'root@rinkeby.linkdrop.io',
      branch: 'dev'
    }
  })

  shipit.blTask('installDependencies', async () => {
    await shipit.remote(
      `cd ${shipit.releasePath} && yarn cache clean && yarn install`
    )
    shipit.log('Installed yarn dependecies')
  })

  shipit.task('copyConfig', async () => {
    await shipit.copyToRemote(
      '../../configs/server.config.json',
      'linkdrop/linkdrop-monorepo/current/configs/server.config.json'
    )
  })

  shipit.task('compileContracts', async () => {
    await shipit.remote(`cd ${shipit.releasePath} && yarn compile-contracts`)
  })

  shipit.blTask('stopApp', async () => {
    try {
      await shipit.remote(
        `cd ${
          shipit.releasePath
        } && pm2 stop ${PM2_APP_NAME} && pm2 delete ${PM2_APP_NAME}`
      )
      shipit.log('Stopped app process')
    } catch (err) {
      shipit.log('No previous process to restart. Continuing.')
    }
  })

  shipit.blTask('startApp', async () => {
    await shipit.remote(
      `cd ${
        shipit.releasePath
      } && pm2 start --name ${PM2_APP_NAME} npm -- run server`
    )
    shipit.log('Started app process')
  })

  shipit.on('updated', () => {
    shipit.start(['installDependencies'])
  })

  shipit.on('published', () => {
    shipit.start(['copyConfig', 'compileContracts', 'stopApp', 'startApp'])
  })
}
