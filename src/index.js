import { app } from "./app.js";
import { homedir } from "os";

const username = process.argv[2].split("=")[1];
// const usernameArg = args.find((arg) => arg.startsWith("--username="));
console.log(username);
// const username = usernameArg ? usernameArg.split("=")[1] : "Anonymous";

const greeting = () => {
  console.log(`Welcome to the File Manager, ${username}!`);
};

greeting();
app(username, homedir());
