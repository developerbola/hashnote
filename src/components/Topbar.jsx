import { useState } from "react";
import { date } from "../utils/dates";
import SettingsMenu from "./SettingsMenu";
const Topbar = ({ setToken, token, username, setUsername }) => {
  const [active, setActive] = useState(false);
  const addZero = (number) => {
    return number < 10 ? "0" + number : number;
  };
  return (
    <div className="topbar-container">
      <div className="topbar-wrapper">
        <h1 className="day">{addZero(date[0])}</h1>
        <div className="months-names">
          <p>{date[2]}</p>
          <h1>{date[1]}</h1>
        </div>
      </div>
      <div>
        <button className="settings-button" onClick={() => setActive(!active)}>
          <img src="./svg_icons/settings.svg" />
        </button>
        <SettingsMenu
          active={active}
          setActive={setActive}
          token={token}
          setToken={setToken}
          username={username}
          setUsername={setUsername}
        />
      </div>
    </div>
  );
};

export default Topbar;
