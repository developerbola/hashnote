import { createContext } from "react";

const initialFunctions = {
  editorValue: "",
  setEditorValue: null,
  filePath: "",
  setFilePath: null,
};

const initialFolders = {
  folders: {},
  setFolders: null,
  loadFilesFromDisk: null,
};

const initialGithub = {
  username: "",
  token: "",
  setUsername: null,
  setToken: null,
};

export const FunctionsContext = createContext(initialFunctions);
export const FoldersContext = createContext(initialFolders);
export const GithubContext = createContext(initialGithub);
