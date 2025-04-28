import { useContext, useEffect, useState } from "react";
import { FunctionsContext } from "./context";
import { readFile } from "../utils/readDataFromFile";

export const FunctionsProvider = ({ children }) => {
  const [editorValue, setEditorValue] = useState("");
  const [filePath, setFilePath] = useState("");

  useEffect(() => {
    if (!filePath) return;

    const readValue = async () => {
      try {
        const data = await readFile(filePath);
        setEditorValue(data);
      } catch (error) {
        console.error("Failed to read file:", error);
      }
    };

    readValue();
  }, [filePath]);

  return (
    <FunctionsContext.Provider
      value={{ editorValue, setEditorValue, filePath, setFilePath }}
    >
      {children}
    </FunctionsContext.Provider>
  );
};

export const useFunctions = () => {
  return useContext(FunctionsContext);
};
