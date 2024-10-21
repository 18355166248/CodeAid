import { execSync } from "node:child_process";
import chalk from "chalk";

// source ~/.nvm/nvm.sh：加载 nvm 脚本，使 nvm 命令在当前 shell 会话中可用。
// nvm use 20：在成功加载 nvm 后，执行 nvm use 20 命令，切换到 Node.js 版本 20。
// { stdio: 'inherit', shell: '/bin/bash' }：指定使用 /bin/bash 作为 shell，并将子进程的标准输入输出继承到父进程中，以便在控制台中显示命令的输出。
try {
  execSync("source ~/.nvm/nvm.sh && nvm use 20 && npm run docusaurus:start", {
    stdio: "inherit",
    shell: "/bin/bash",
  });
  chalk.green("Switched to Node.js version 20 and started the docusaurus");
} catch (error) {
  chalk.red("Error:", error.message);
}
