export const state = {
  logotext: '@webboot/crypto',

  menu: [
    { to: '/#installation', text: 'installation' },
    {
      to: '/#usage', text: 'usage', items: [
        { to: '-exec', text: 'exec', },
        { to: '-get-domain', text: 'getDomain' },
        { to: '-get-email', text: 'getEmail' },
        { to: '-get-files', text: 'getFiles' },
        { to: '-get-git-host', text: 'getGitHost' },
        { to: '-get-git-pgp-keys', text: 'getGitPgpKeys' },
        { to: '-get-passphrase', text: 'getPassphrase' },
        { to: '-get-pgp-key', text: 'getPgpKey' },
        { to: '-get-version', text: 'getVersion' },
        { to: '-http-request', text: 'httpRequest' },
        { to: '-json', text: 'json' },
        { to: '-numeric-prompt', text: 'numericPrompt' },
        { to: '-three-way-verify-file', text: 'threeWayVerifyFile' },
      ]
    },
  ],
}
