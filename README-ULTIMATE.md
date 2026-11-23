# CROSS OS Simulator 2.1.0

A browser-based desktop simulator for Termux/Android. It is not a replacement for Android and does not boot as a native OS.

## Run in Termux

```sh
cd ~/CROSS-OS-ULTIMATE
python backend/server.py
```

Open `http://127.0.0.1:8000` in the Android browser. Stop the server with Ctrl+C.

## Create and publish an app
1. Open **Code Studio** and create/edit `index.html` (optional `style.css` and `script.js` files are supported).
2. Use **Run Preview** to preview the project.
3. Choose **Publish to Store**. Fill in the app metadata and select **Publish to CROSS Store**.
4. Open **CROSS Store** and install the published app.
5. To share it with another CROSS OS browser, use **Export app package** in Publisher and **Import package** in the other Store.

Apps are packaged as JSON text files and launched in a restricted iframe sandbox. No APKs or native executables are installed.

## Tests

```sh
node tests/ultimate-features-smoke.js
```

The smoke test checks feature integration and syntax. It is not a substitute for testing on the target Android browser.
