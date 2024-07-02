# Fractal Test

## Requirements

-   nvm with [shell integration](https://github.com/nvm-sh/nvm#bash)
-   Node [`lts/gallium`](https://nodejs.dev/en/about/releases/)
-   NPM 8

## Starting the Fractal styleguide server

1. `npm install`
2. `npm run fractal:start` (Runs Gulp and starts the Fractal preview server)
3. The Fractal preview server should open in your browser. If not, you should see a message about the server running – go to the URL printed in your terminal.

## Encrypted build

Using [staticrypt](https://github.com/robinmoisson/staticrypt). StatiCrypt uses AES-256 and WebCrypto to encrypt HTML files and provides a login page.

Password for this repo is `$eG%7qey`

* Github CI Worfklow: The password is stored as a variable named `STATICRYPT_PASSWORD`. This can be configured in (`Settings` > `Security` > `Actions` > `Secrets` tab). This variable is injected into the Github Actions workflow script.
* If you alternatively require a password to be set via a different method, create a `.env` file in the root of this repo, with the contents: `STATICRYPT_PASSWORD=$eG%7qey`

A couple of changes made in this repo:

* Login page (`./staticrypt-template.html`). Forked from the [origina](https://raw.githubusercontent.com/robinmoisson/staticrypt/main/lib/password_template.html).
  * Added line `210`: Manually set the value to the remember me checkbox to true so this is always set
  * Lines: `253` to `258` - Always hide the 'Remember Me' checkbox as we're manually setting the value
* Created a `.env` file. This is where the login password is stored.
* We're using Salt which will allow the "Remember Me" (Hardcoded to true) to allow the login to work between pages.
* The entire `./build` folder is being protected. A few config options are applied in the `npx staticrypt` script below.

### Setup

1. Install and save to DevDependencies: `npm install staticrypt --save-dev`

2. `.env` file contains the password

3. Run the `staticrypt` command to create a `staticrypt.json` file:
 - Provide `--short` to hide warnings, and `--salt` to provide a salt which will enable the 'remember me' options between pages.
 - Setting remember me to true requires cookies but will not require the password to be entered for each page and component preview.

```
npx staticrypt \
    --short  \
    --salt 12345678901234567890123456789012 \
    -t ./staticrypt-template.html \
    --template-color-primary "#9c0067" \
    --template-color-secondary "#213B70" \
    --template-title "test-fractal" \
    --template-instructions "This page is password protected" \
    --template-error "Incorrect password" \
    --is-remember-enabled "1" \
    --template-remember-value "1" \
    ./build/* -r -d ./build
```
