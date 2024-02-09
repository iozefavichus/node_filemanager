import { createInterface } from "readline/promises";
import { resolve } from "path";

import * as AllCommands from "./commands.js";
import { calculateHash } from "./hash.js";
import { operatingSystem } from "./os.js";

import { validate } from "./validate.js";

const parseInput = (str) => {
  const newStr = str.replace(/\s+/g, " ");
  const matches = newStr.match(/(['"])(.*?)\1|\S+/g);

  const parsedPieces = matches.map((piece) => {
    if (piece.startsWith('"') && piece.endsWith('"')) {
      return piece.slice(1, -1);
    } else if (piece.startsWith("'") && piece.endsWith("'")) {
      return piece.slice(1, -1);
    }
    return piece;
  });

  return parsedPieces;
};

export const app = async (username, homedir) => {
  let currentDir = homedir;

  const goodbye = () => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  };

  process.on("exit", () => goodbye());

  process.on("SIGINT", () => {
    process.exit();
  });

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const exit = () => {
    process.exit();
  };

  const cd = async ([path]) => {
    console.log('HERE');
    currentDir = await AllCommands.cd(currentDir, path);
  };

  process.on("exit", () => goodbye());

  const up = async () => {
    currentDir = resolve(currentDir, "..");
  };

  const add = async ([path]) => {
    const filePath = resolve(currentDir, path);
    await AllCommands.add(filePath);
  };

  const cat = async ([path]) => {
    const filePath = resolve(currentDir, path);

    await AllCommands.cat(filePath);
  };

  const ls = async () => {
    await AllCommands.ls(currentDir);
  };

  const hash = async ([path]) => {
    const filePath = resolve(currentDir, path);

    await calculateHash(filePath);
  };

  const rn = async ([path, newFilename]) => {
    const filePath = resolve(currentDir, path);

    await AllCommands.rn(filePath, newFilename);
  };

  const cp = async ([source, destination]) => {
    const sourcePath = resolve(currentDir, source);

    await AllCommands.cp(sourcePath, destination);
  };

  const mv = async ([source, destination]) => {
    const sourcePath = resolve(currentDir, source);

    await AllCommands.mv(sourcePath, destination);
  };

  const rm = async ([path]) => {
    const filePath = resolve(currentDir, path);

    await AllCommands.rm(filePath);
  };

  const os = async ([arg]) => {
    operatingSystem(arg);
  };

  const compress = async ([source, destination]) => {
    const sourcePath = resolve(currentDir, source);
    const destinationPath = resolve(currentDir, destination);

    await AllCommands.compressFile(sourcePath, destinationPath);
  };

  const decompress = async ([source, destination]) => {
    const sourcePath = resolve(currentDir, source);
    const destinationPath = resolve(currentDir, destination);

    await AllCommands.decompressFile(sourcePath, destinationPath);
  };

  const commands = new Map([
    [".exit", exit],
    ["up", up],
    ["cd", cd],
    ["ls", ls],
    ["cat", cat],
    ["add", add],
    ["rn", rn],
    ["cp", cp],
    ["mv", mv],
    ["rm", rm],
    ["os", os],
    ["hash", hash],
    ["compress", compress],
    ["decompress", decompress],
  ]);

  while (true) {
    const answer = await rl.question(`You are currently in ${currentDir}\n`);
    const [command, ...args] = parseInput(answer);
    console.log(command, args);

    const commandFn = commands.get(command);
    console.log(args);
    console.log("Command", commandFn);
    console.log(validate(command, args));

    if (commandFn && validate(command, args)) {
      try {
        await commandFn(args);
      } catch (error) {
        console.log(`Operation failed. ${error?.message ? error.message : ""}`);
      }
    } else {
      console.log("Invalid input");
    }
  }
};
