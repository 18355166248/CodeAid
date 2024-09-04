import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./css/tailwindcss.css";
import { ConfigProvider, theme, App as AntdApp } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      componentSize="small"
      theme={{
        algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
        token: {
          colorTextPlaceholder: "var(--vscode-editor-text-color)",
        },
        components: {
          Input: {
            inputFontSize: 11,
            /* 这里是你的组件 token */
            activeBg: "transparent",
            hoverBg: "transparent",
          },
        },
      }}
    >
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
);
