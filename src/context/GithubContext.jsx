import { useContext, useState } from "react";
import { GithubContext } from "./context";
import { readToken, readUsername } from "../utils/readDataFromFile";

export const GithubProvider = ({ children }) => {
  const [username, setUsername] = useState(readUsername());
  const [token, setToken] = useState(readToken());
  return (
    <GithubContext.Provider value={{ username, setUsername, token, setToken }}>
      {children}
    </GithubContext.Provider>
  );
};

export const useGithub = () => {
  return useContext(GithubContext);
};
