import { useRef } from "react";

const useLatest = <T>(v: T): React.MutableRefObject<T> => {
  const messagesRef = useRef(v);
   return messagesRef ;
};
export default useLatest;
