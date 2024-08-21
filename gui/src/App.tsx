import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        {window.vscMediaUrl ? (
          <div className="flex justify-around">
            <a href="https://www.ximalaya.com" target="_blank">
              <img
                src={`${window.vscMediaUrl}/img/vite.svg`}
                className="logo"
                alt="Vite logo"
              />
            </a>
            <a href="https://www.ximalaya.com" target="_blank">
              <img
                src={`${window.vscMediaUrl}/img/react.svg`}
                className="logo"
                alt="Vite logo"
              />
            </a>
          </div>
        ) : null}
      </div>
      <h1>Vite + React</h1>
      <div className="card text-yellow-500">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more1
      </p>
    </>
  );
}

export default App;
