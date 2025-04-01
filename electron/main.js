import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

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
