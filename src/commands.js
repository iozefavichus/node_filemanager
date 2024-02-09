import { createReadStream, createWriteStream } from 'fs';
import { writeFile, rename, readdir, stat, rm as removeFile } from 'fs/promises';
import { basename, resolve, dirname, join } from 'path';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { pipeline } from 'stream/promises';

const isExists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const cd = async (currentDir, path) => {
  console.log('THERE', currentDir, path);
  const dirPath = resolve(currentDir, path);
  console.log('DIRPATH', dirpath);

  if (!(await isExists(dirPath))) {
    console.log('ERROR');
    throw new Error("This directory does not exist");
  } else {
    return dirPath;
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

const rm = async (filePath) => {
  if (!(await isExists(filePath))) {
    throw new Error("File does not exist");
  }

  try {
    await removeFile(filePath);
  } catch {
    throw new Error("Error while deleting file");
  }
};

const mv = async (sourcePath, destinationDir) => {
  if (!(await isExists(sourcePath))) {
    throw new Error("No such original file");
  }

  if (!(await isExists(destinationDir))) {
    throw new Error("No such destination directory");
  }

  const fileName = basename(sourcePath);
  const targetPath = resolve(destinationDir, fileName);

  if (await isExists(targetPath)) {
    throw new Error("File already exists in destination directory");
  }

  const sourceStream = createReadStream(sourcePath);
  const destinationStream = createWriteStream(targetPath);

  sourceStream.pipe(destinationStream);

  try {
    await removeFile(sourcePath);
  } catch {
    throw new Error("Error while deleting file");
  }
};

const cp = async (sourcePath, destinationDir) => {
  if (!(await isExists(sourcePath))) {
    throw new Error("No such original file");
  }

  if (!(await isExists(destinationDir))) {
    throw new Error("No such destination directory");
  }

  const fileName = basename(sourcePath);
  const targetPath = resolve(destinationDir, fileName);

  if (await isExists(targetPath)) {
    throw new Error("File already exists in destination directory");
  }

  const sourceStream = createReadStream(sourcePath);
  const destinationStream = createWriteStream(targetPath);

  sourceStream.pipe(destinationStream);
};

const rn = async (filePath, newFilename) => {
  if (!(await isExists(filePath))) {
    throw new Error("No such original file");
  }

  const directory = dirname(filePath);
  const newFilePath = join(directory, newFilename);

  if (await isExists(newFilePath)) {
    throw new Error("File with that name already exists");
  }

  try {
    await rename(filePath, newFilePath);
  } catch {
    throw new Error("Error while renaming file");
  }
};

const ls = async (currentDir) => {
  try {
    const files = await readdir(currentDir, { withFileTypes: true });
    const items = [];

    for (const file of files) {
      const fileName = file.name;
      const filePath = join(currentDir, fileName);
      const fileStats = await stat(filePath);

      if (fileStats.isDirectory()) {
        items.push({ Name: fileName, Type: 'directory' });
      } else if (fileStats.isFile() && !fileStats.isSymbolicLink()) {
        const formattedFileName = `${fileName}`;
        items.push({ Name: formattedFileName, Type: 'file' });
      }
    }

    const sortedItems = items.sort((a, b) => {
      if (a.Type === b.Type) {
        return a.Name.localeCompare(b.Name);
      } else if (a.Type === 'directory') {
        return -1;
      } else {
        return 1;
      }
    });

    console.table(sortedItems);
  } catch (error){
    throw new Error(`Directory read error ${error}`);
  }
}

const compressFile = async (sourcePath, destinationPath) => {
  if (!await isExists(sourcePath)) {
		throw new Error('No such original file');
	}

  const sourceStream = createReadStream(sourcePath);
  const destinationStream = createWriteStream(destinationPath);
  const brotliStream = createBrotliCompress();

  await pipeline(sourceStream, brotliStream, destinationStream);
}

const decompressFile = async (sourcePath, destinationPath) => {
	if (!await isExists(sourcePath)) {
		throw new Error('No such original file');
	}

  const sourceStream = createReadStream(sourcePath);
  const destinationStream = createWriteStream(destinationPath);
  const brotliStream = createBrotliDecompress();

  await pipeline(sourceStream, brotliStream, destinationStream);
}

export { add, cat, rm, mv, cp, rn, cd, ls, compressFile, decompressFile };
