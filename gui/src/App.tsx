import remarkGfm from "remark-gfm";
import MarkdownRenderer from "./components/MarkdownRenderer";

const demoMdStr = `
  # GFM

  ## Autolink literals

  www.example.com, https://example.com, and contact@example.com.

  ## Footnote

  A note[^1]

  [^1]: Big note.

  ## Strikethrough

  ~one~ or ~~two~~ tildes.

  ## Table

  | a | b  |  c |  d  |
  | - | :- | -: | :-: |
  | 2 | 3  | 4  | 5   |

  \`\`\`javascript
    class calculator {
      constructor() {
        this.result = 0;
      }
    }
  \`\`\`

  ## Tasklist

  * [ ] to do
  * [x] done
`;

function App() {
  return (
    <>
      <div>
        <MarkdownRenderer remarkPlugins={[remarkGfm]}>
          {demoMdStr}
        </MarkdownRenderer>
      </div>
    </>
  );
}

export default App;
