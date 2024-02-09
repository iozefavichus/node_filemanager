import { createHash } from "crypto";
import { readFile } from "fs/promises";

export const isExists = async (path) => {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  };

const calculateHash = async (filePath) => {
  if (!(await isExists(filePath))) {
    throw new Error("File does not exist");
  }

  const hash = createHash("sha256");
  try {
    const content = await readFile(filePath);
    hash.update(content);
    const hashContent = hash.digest("hex");
    console.log(hashContent);
  } catch (error) {
    throw new Error("Can not calculate hash");
  }
};

export { calculateHash };
