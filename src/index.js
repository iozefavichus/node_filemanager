import { app } from "./app.js";
import { homedir } from 'os';

const args = process.argv.slice(2);
const usernameArg = args.find((arg) => arg.startsWith("--username="));
const username = usernameArg ? usernameArg.split("=")[1] : "Anonymous";

const greeting = () => {
  console.log(`Welcome to the File Manager, ${username}!`);
};

greeting();
app(username, homedir());
