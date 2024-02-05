import { createInterface } from "readline/promises";
import { resolve } from "path";

import * as commands from "./commands.js";

export const app = async (username, homedir) => {
  let currentDir = homedir;

  const goodbye = () => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  };

  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const exit = () => {
    process.exit();
  };

  process.on("exit", () => goodbye());

  const up = async () => {
    currentDir = resolve(currentDir, "..");
  };

  const add = async ([path]) => {
    const filePath = resolve(currentDir, path);
    await commands.add(filePath);
  };

  const cat = async ([path]) => {
    const filePath = resolve(currentDir, path);

    await commands.cat(filePath);
  }

  const commands = new Map([
    [".exit", exit],
    ["up", up],
    ["add", add],
    ["cat", cat],
  ]);

  while (true) {
    const answer = await readline.question(`You are currently in ${currentDir}\n`);
    const [command, ...args] = answer;

    const commandFn = commands.get(command);

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
