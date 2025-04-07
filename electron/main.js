import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let splashWindow;

function createWindow() {
  // Splash screen window
  splashWindow = new BrowserWindow({
    width: 600,
    height: 600,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
  });

  splashWindow.loadURL(`file://${path.join(__dirname, "../public/splash.html")}`);

  // Main window
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    icon: path.join(__dirname, "../public/icon.icns"),
    frame: false,
    resizable: false,
    transparent: true,
    backgroundColor: "#151515",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startURL = app.isPackaged
    ? `file://${path.join(__dirname, "../dist/index.html")}`
    : "http://localhost:3005";

  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", () => {
    // Close splash and show main window
    if (splashWindow) {
      splashWindow.close();
    }
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  if (process.platform === "darwin") {
    app.dock.setIcon(path.join(__dirname, "public", "icon.icns"));
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
