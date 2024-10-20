// 这个函数是一个 React 自定义 Hook，用于管理计数器的状态。
export function useCount() {
  // 使用 useState Hook 初始化计数器状态，初始值为0。
  const [count, setCount] = useState(0);

  // 返回一个对象，包含当前计数值和更新计数值的函数。
  return { count, setCount };
}

// 翻译下下面的代码
export function useTime(num) {
  const [time, setTimer] = React.useState(null);
  React.useEffect(() => {
    if (num) clearInterval(time);
  }, []);
  return { time, setTimer };
}
