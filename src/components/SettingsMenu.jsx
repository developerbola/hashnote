import { useState } from "react";
import { handleSaveToFile } from "../utils/handlers";

const SettingsMenu = ({
  active,
  setActive,
  token,
  setToken,
  username,
  setUsername,
}) => {
  const [fieldValues, setFieldValues] = useState({ username, token });

  const handleOnChange = (name, value) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setActive(!active);
    setUsername(fieldValues.username);
    handleSaveToFile("username.txt", fieldValues.username);
    setToken(fieldValues.token);
    handleSaveToFile("token.txt", fieldValues.token);
  };

  return (
    <div
      className="settings-container"
      style={{ right: active ? "10px" : "-100%" }}
    >
      <div className="titlebar">
        <h2>Settings</h2>
        <button className="close-btn" onClick={handleClose}>
          <img src="./svg_icons/plus.svg" height={22} width={22} />
        </button>
      </div>
      <div className="settings-items">
        <div className="settings-item">
          <h4>Github Username</h4>
          <input
            type="text"
            className="settings-field"
            onChange={(e) => handleOnChange("username", e.target.value)}
            value={fieldValues.username}
          />
        </div>
        <div className="settings-item">
          <h4>Github Token</h4>
          <textarea
            className="settings-field"
            onChange={(e) => handleOnChange("token", e.target.value)}
            value={fieldValues.token}
          />
        </div>
      </div>
      <div
        className="version"
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <a href="https://github.com/developerbola/hashnote">Code</a>
        <p>v1.0.0</p>
      </div>
    </div>
  );
};

export default SettingsMenu;
