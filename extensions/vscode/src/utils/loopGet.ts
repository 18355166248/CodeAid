export async function loopGet(
  data: Record<string, any>,
  key: string,
  cb: () => void,
) {
  try {
    let i = 0;
    while (!data[key] || i < 10) {
      console.log(112233, i);
      if (i >= 10) {
        return;
      }

      setTimeout(() => {
        i++;
      }, 500);
    }
    cb();
  } catch (error) {}
}
