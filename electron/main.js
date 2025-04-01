import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Tray,
  Menu,
} from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let popupWindow;
let tray;

// Create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    icon: path.join(__dirname, "../public/icon.icns"),
    frame: false,
    resizable: false,
    transparent: true,
    backgroundColor: "#151515",
    webPreferences: {
      preload: `file://${__dirname}/preload.js`,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startURL = app.isPackaged
    ? `file://${path.join(__dirname, "../dist/index.html")}`
    : "http://localhost:3005";

  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", () => {
    mainWindow.setVisibleOnAllWorkspaces(false);
  });
}

// Create the popup window
function createPopupWindow() {
  // If the popup window already exists, show it
  if (popupWindow) {
    popupWindow.show();
    return;
  }

  popupWindow = new BrowserWindow({
    width: 300,
    height: 400,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load a separate HTML file for the popup
  const popupURL = app.isPackaged
    ? `file://${path.join(__dirname, "../dist/popup.html")}`
    : "http://localhost:3005/popup.html"; 

  popupWindow.loadURL(popupURL);

  // Position the window near the tray (you can adjust this)
  const trayBounds = tray.getBounds();
  popupWindow.setPosition(trayBounds.x, trayBounds.y + trayBounds.height + 5);

  // Hide the window when it loses focus
  popupWindow.on("blur", () => {
    popupWindow.hide();
  });

  popupWindow.on("closed", () => {
    popupWindow = null;
  });
}

// Create the system tray
function createTray() {
  tray = new Tray(path.join(__dirname, "../public/tray_icon.png"));
  tray.on("click", () => {
    createPopupWindow();
  });
  tray.setToolTip("Hashnote");
}

app.whenReady().then(() => {
  createWindow();
  createTray(); // Initialize the tray

  if (process.platform === "darwin") {
    app.dock.setIcon(path.join(__dirname, "public", "icon.icns"));
  }

  // Global Shortcut
  globalShortcut.register("Control+Space", () => {
    if (mainWindow) mainWindow.show();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
