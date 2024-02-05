const isExists = async (path) => {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  };

const cat = async (filePath) => {
  if (!(await isExists(filePath))) {
    throw new Error("No such original file");
  }

  const readableStream = createReadStream(filePath, "utf8");

  readableStream.on("data", (chunk) => {
    process.stdout.write(chunk);
  });

  readableStream.on("end", () => {
    process.stdout.write("\n");
  });

  await new Promise((resolve, reject) => {
    readableStream.on("end", () => resolve());
    readableStream.on("error", () => reject());
  });
};

const add = async (filePath) => {
  try {
    await writeFile(filePath, "", { flag: "wx" });
  } catch {
    throw new Error("Failed to add file");
  }
};

export { add, cat };
