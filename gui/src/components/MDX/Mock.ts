export const demoMdStr = `
  # GFM

  ## Autolink literals

  www.example.com, https://example.com, and contact@example.com.

  [Bing地址](https://cn.bing.com/)

  ## 脚注

  A note[^1]

  B note[^2]

  [^1]: Big note.

  [^2]: 第二个脚注.

  ## Strikethrough

  ~one~ or ~~two~~ tildes.

  ## Table

  | 参数       | 说明                       |    类型  |
  | ----      | --------                  | -------  |
  | itemId    | \`number \\| string \`    |  string  |
  | source    | 来源                       |  string  |
  | currPage  | 当前页面名称                |  string  |

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

  ## 数学公式

  $$
  \\sin^2(\\theta) + \\cos^2(\\theta) = 1
  $$

  $$
  \\sum_{n=1}^\\infty k
  $$

  $$
  \\int_a^bf(x)\\,dx
  $$

  $$
  \\lim\\limits_{x\\to\\infty} \\exp(-x) = 0
  $$
`;
