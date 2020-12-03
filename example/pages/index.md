<div>

## @webboot/core

This is the @webboot/core library.

It provides some utility functions

**not audited and deployed yet. please be careful**

[webboot](https://webboot.org) aims to make
[tofu - trust on first use](https://en.wikipedia.org/wiki/Trust_on_first_use)
a bit less scary.

### <a name="install"></a>install
```bash
npm install --save-exact @webboot/core
```

### <a name="usage"></a>usage

```javascript
import webboot from '@webboot/core'
```

### <a name="usage-exec"></a>exec

child_process.exec with nicer output

```javascript
import webboot from '@webboot/core'

// options get passed to child_process.exec
const options = {}
const result = await webboot.exec('ls -la', options)
console.log({ result })
```

### <a name="usage-get-domain"></a>getDomain

Gets the page domain from cli args, {dir}/CNAME or package.json

```javascript
import webboot from '@webboot/core'

const state = {
  // gets priority, if set.
  domain: 'https://domain.com',
}

const domain = webboot.getDomain(state)
// returns state.domain, the value of {dir}/CNAME or package.json .homepage field
```

### <a name="usage-get-email"></a>getEmail

returns state.email or git config user.email

```javascript
import webboot from '@webboot/core'

const state = {
  email: 'email@domain.com',
}

const email = webboot.getEmail(state)
// returns state.email or git config user.email
```

### <a name="usage-get-files"></a>getFiles

returns state.files if it exists,
otherwise looks in state.dir for files and returns them and their contents as an array.

```javascript
import webboot from '@webboot/core'

const state = {
  files: [],
  dir: 'docs',
}

const files = webboot.getFiles(state)
// returns all files in docs directory.
```

### <a name="usage-get-git-host"></a>getGitHost

uses `git remote -v` to get the remotes for this repository.
prompts the user for input if multiple remotes exist.

```
import webboot from '@webboot/core'

const gitHost = webboot.getGitHost()
// returns the host based on the git remote
```

### <a name="usage-get-git-pgp-keys"></a>getGitPgpKeys

Loads the github.com and gitlab.com pgp keys for a user.
Support for custom git hosts is wip.

```
import webboot from '@webboot/core'

const state = {
  username: 'git-user',
  host: 'github.com', // 'gitlab.com'
}

const gitHost = await webboot.getGitPgpKeys(state)
// returns the pgp keys registered for this user
```


### <a name="usage-get-passphrase"></a>getPassphrase

gets the passphrase from the webboot passphrase file and decrypts it using gpg.


### <a name="usage-get-pgp-key"></a>getPgpKey

uses gpg --list-keys to find a local gpg key.
prompt for numeric input if multiple keys are found.


### <a name="usage-get-version"></a>getVersion

gets the version of the package.json file.


### <a name="usage-http-request"></a>httpRequest

promisified http request


### <a name="usage-json"></a>json

exposes json parse and stringify


### <a name="usage-numeric-prompt"></a>numericPrompt

prompts the user to input a number between 1 and array length.

returns the chosen item from the array and reprompts on errors with the input.


### <a name="usage-three-way-verify-file"></a>threeWayVerifyFile

checks a list of sri hashes agains a file and the file against itself to make sure the hashes match.

</div>
