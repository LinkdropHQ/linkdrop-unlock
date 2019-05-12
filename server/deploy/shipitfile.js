// shipitfile.js
module.exports = shipit => {
  // Load shipit-deploy tasks
  require('shipit-deploy')(shipit)
  require('shipit-shared')(shipit)

  shipit.initConfig({
    default: {
      deployTo: 'linkdrop/var/www/linkdrop-monorepo',
      repositoryUrl: 'git@github.com:LinkdropProtocol/linkdrop-monorepo.git',
      shared: {
        dirs: ['node_modules'],
        overwrite: true
      }
    },
    staging: {
      servers: 'root@rinkeby.linkdrop.io',
      branch: 'dev'
    }
  })

  // Copy local config file to remote
  shipit.task('copyConfig', async () => {
    await shipit.copyToRemote(
      '../../config/server.config.json',
      'linkdrop/var/www/linkdrop-monorepo/current/config/server.config.json'
    )
  })

  shipit.on('deployed', () => {
    shipit.start('copyConfig')
  })
}
