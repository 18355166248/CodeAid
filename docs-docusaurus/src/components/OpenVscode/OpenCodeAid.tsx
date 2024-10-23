const OpenVSCodeCodeAid = () => (
  <div>
    <span
      className="bg-green-600 p-4 rounded-lg cursor-pointer hover:bg-green-500"
      onClick={() => {
        window.location.href = "vscode:extension/Swell-CodeAid.codeaide";
      }}
    >
      立即安装 CodeAid 插件
    </span>
  </div>
);

export default OpenVSCodeCodeAid;
