export function useCount() {
  const [count, setCount] = useState(0);
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
