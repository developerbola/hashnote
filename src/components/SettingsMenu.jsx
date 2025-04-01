import { useState } from "react";

const SettingsMenu = ({
  active,
  setActive,
  token,
  setToken,
  username,
  setUsername,
}) => {
  const [cToken, setCToken] = useState(token);
  const [cUsername, setCUsername] = useState(username);

  const saveToken = () => {
    try {
      const fs = window.require("fs");
      const path = window.require("path");
      const os = window.require("os");

      const homeDir = os.homedir();
      const appBaseDir = path.join(homeDir, ".hashnote");
      const filePath = path.join(appBaseDir, "token.txt");

      if (!fs.existsSync(appBaseDir)) {
        fs.mkdirSync(appBaseDir, { recursive: true });
      }

      fs.writeFileSync(filePath, cToken, "utf-8");

      console.log("Token saved successfully:", cToken);
    } catch (e) {
      console.error("Error saving token:", e);
    }
  };

  const saveUsername = () => {
    try {
      const fs = window.require("fs");
      const path = window.require("path");
      const os = window.require("os");

      const homeDir = os.homedir();
      const appBaseDir = path.join(homeDir, ".hashnote");
      const filePath = path.join(appBaseDir, "username.txt");

      if (!fs.existsSync(appBaseDir)) {
        fs.mkdirSync(appBaseDir, { recursive: true });
      }

      fs.writeFileSync(filePath, cUsername, "utf-8");

      console.log("Username saved successfully:", cUsername);
    } catch (e) {
      console.error("Error saving username:", e);
    }
  };

  return (
    <div
      className="settings-container"
      style={{ left: active ? "calc(100% - 415px)" : "100%" }}
    >
      <div className="titlebar">
        <h2>Settings</h2>
        <button className="close-btn" onClick={() => setActive(!active)}>
          <img src="./svg_icons/plus.svg" height={22} width={22} />
        </button>
      </div>
      <div className="settings-items">
        <div className="settings-item">
          <h4>Github Username</h4>
          <input
            type="text"
            className="settings-field"
            onChange={(e) => setCUsername(e.target.value)}
            value={cUsername}
          />
          <button
            className="settings-btn"
            onClick={() => {
              if (username !== cUsername) {
                saveUsername();
                setUsername(cUsername);
              }
            }}
          >
            Save
          </button>
        </div>
        <div className="settings-item">
          <h4>Github Token</h4>
          <textarea
            className="settings-field"
            onChange={(e) => setCToken(e.target.value)}
            value={cToken}
          />
          <button
            className="settings-btn"
            onClick={() => {
              if (token !== cToken) {
                saveToken();
                setToken(cToken);
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
