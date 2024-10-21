const OpenVSCodeCodeAid = () => (
  <div
    className="bg-green-600 p-4 rounded-lg cursor-pointer hover:bg-green-500"
    onClick={() => {
      window.location.href = "vscode:extension/dbaeumer.vscode-eslint";
    }}
  >
    立即安装 CodeAid 插件
  </div>
);

export default OpenVSCodeCodeAid;
