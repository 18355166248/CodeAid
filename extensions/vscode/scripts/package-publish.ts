import { exec } from "node:child_process";
import chalk from "chalk";
import fs from "fs";

// source ~/.nvm/nvm.sh：加载 nvm 脚本，使 nvm 命令在当前 shell 会话中可用。
// nvm use 20：在成功加载 nvm 后，执行 nvm use 20 命令，切换到 Node.js 版本 20。
// { stdio: 'inherit', shell: '/bin/bash' }：指定使用 /bin/bash 作为 shell，并将子进程的标准输入输出继承到父进程中，以便在控制台中显示命令的输出。
try {
  let command, options, command2;

  switch (process.platform) {
    case "win32":
      command =
        'powershell.exe -Command "nvm use 20; vsce package --out ./build patch --no-dependencies"';
      command2 =
        'powershell.exe -Command "nvm use 20; vsce publish --no-dependencies"';
      options = {};
      break;
    case "darwin":
    case "linux":
      command =
        "source ~/.nvm/nvm.sh && nvm use 20 && vsce package --out ./build patch --no-dependencies";
      command2 =
        "source ~/.nvm/nvm.sh && nvm use 20 && vsce publish --no-dependencies";
      options = { shell: "/bin/bash" };
      break;
    default:
      console.error(`Unsupported platform: ${process.platform}`);
      process.exit(1);
  }

  if (!fs.existsSync("build")) {
    fs.mkdirSync("build");
  }
  exec(command, options, (error) => {
    if (error) {
      console.log(chalk.red("Error:", error.message));
      return;
    }

    console.log(chalk.green("打包成功"));

    exec(command2, options, (error) => {
      if (error) {
        console.log(chalk.red("Error:", error.message));
        return;
      }

      console.log(chalk.green("发布成功🎉🎉🎉"));
      console.log("\n");
    });
  });
} catch (error: any) {
  console.log(chalk.red("Error:", error.message));
}
