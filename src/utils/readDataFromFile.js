const fs = window.require("fs");
const path = window.require("path");
const os = window.require("os");
const homeDir = os.homedir();
const appBaseDir = path.join(homeDir, ".hashnote");

export const readToken = () => {
  try {
    // Get directory
    const filePath = path.join(homeDir, ".hashnote", "token.txt");

    if (!fs.existsSync(appBaseDir)) {
      fs.mkdirSync(appBaseDir, { recursive: true });
    }

    // Check if token file exists
    if (fs.existsSync(filePath)) {
      const token = fs.readFileSync(filePath, "utf-8");
      return token;
    } else {
      console.warn("Token file does not exist. So created one.");
      fs.writeFileSync(filePath, "");
      return "";
    }
  } catch (e) {
    console.error("Error reading token:", e);
    return "";
  }
};

export const readUsername = () => {
  try {
    // Get directory
    const filePath = path.join(homeDir, ".hashnote", "username.txt");
    // Check if username file exists
    if (fs.existsSync(filePath)) {
      const username = fs.readFileSync(filePath, "utf-8");
      return username;
    } else {
      console.warn("Username file does not exist. So created one.");
      fs.writeFileSync(filePath, "");
      return "";
    }
  } catch (e) {
    console.error("Error reading username:", e);
    return "";
  }
};

export const readFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      if (fs.existsSync(filePath)) {
        const fileValue = fs.readFileSync(filePath, "utf-8");
        resolve(fileValue);
      } else {
        console.warn("File does not exist.");
        resolve("");
      }
    } catch (e) {
      console.error("Error reading file:", e);
      reject(e);
    }
  });
};
