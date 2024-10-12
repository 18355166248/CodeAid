export interface LoopTaskProps<T, Res> {
  fn: (params: T) => Promise<Res>;
  params: T;
  handler?: (params: Res) => Promise<any> | boolean; // 回调成功后的处理
  handlerError?: (err: any) => boolean; // 回调失败后的处理
  interval?: number;
  successCallback: (res: Res) => void;
  errorCallback: (err: any) => void;
  timeout?: number;
}

// 轮训异步回调
export function loopTask<T, Res>({
  fn,
  params,
  interval = 3,
  handler,
  handlerError,
  timeout = 1500,
  successCallback,
  errorCallback,
}: LoopTaskProps<T, Res>) {
  fn(params)
    .then((res) => {
      return handler ? handler(res) : res;
    })
    .catch((err) => {
      if (interval > 1 && (handlerError ? handlerError(err) : true)) {
        setTimeout(() => {
          loopTask({
            fn,
            params,
            interval: interval - 1,
            handler,
            handlerError,
            timeout,
            successCallback,
            errorCallback,
          });
        }, timeout);
      } else {
        errorCallback(err);
      }
      // 避免进入下个then
      return Promise.reject(err);
    })
    .then((res) => {
      successCallback(res);
    })
    .catch(() => {
      // console.log("🚀 ~ err:", fn.name, err);
      // 避免控制台直接报错, 影响三方插件比如 Sentry 上报
    });
}
