# node-api-base

Steps are necessary to get the application up and running:

## Preparing environment

Install Node: 
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E sh -
sudo apt-get install -y nodejs
```

Verifing if node version is 8.x
```
node -v
```

## Databases things

In the work directory, download dependencies:
```
npm install
```

To populate development database:
 - run the application
 - open another terminal (Ctrl + Alt + T) and go to server folder (e.g. cd /server)
    ```
    npm run seed
    ```

## Test and Coverage

To run automated tests, run:
```
npm run test
```

To view code coverage, run:
```
npm run coverage
```
So, go to coverage folder (cd /server/coverage) and open the _index.html_ in a browser.

## Run the server

So every time you need to start the app, run:
```
npm start
```

Application started on http://localhost:3030

Swagger API Docs on http://localhost:3030/swagger-ui.html

## Subliminal message

_Tip 1: install vscode_

_Tip 2: install eslint (npm install -g eslint)_

_and_

_Be happy during development ;)_
