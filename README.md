# React Zoom Clone

This React/Node.js codebase implements Zoom's core features using the SignalWire Video SDK and the SignalWire Video REST API.

## Running the app

First create a new `.env` file in the format below:

```
PROJECT_ID=<Your SignalWire Project ID here>
SPACE=https://<Your SignalWire Username here>.signalwire.com/api/video
API_KEY=<Your API token here>
```

To start both the frontend and the backend at once:

```
cd video
yarn install
cd ..
yarn install
yarn dev
```


