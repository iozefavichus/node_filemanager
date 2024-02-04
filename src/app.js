import { createInterface } from "readline/promises";

const parseInput = (str) => {};

export const app = async (username, homedir) => {
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

  const commands = new Map([[".exit", exit]]);

  while (true) {
    const answer = await readline.question(`You are currently in ${homedir}\n`);
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
