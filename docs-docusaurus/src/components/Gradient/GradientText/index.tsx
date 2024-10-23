import { useMemo } from "react";
import styles from "./index.module.css";

function GradientText({
  children,
  startGradientColor = "#ffffff",
  endGradientColor = "#21d8a3",
  fontSize = 20,
  style = {},
}) {
  const _style = useMemo(() => {
    return {
      ...style,
      backgroundImage: `linear-gradient(90deg, ${startGradientColor}, ${endGradientColor})`,
      fontSize,
    };
  }, [style]);
  return (
    <div style={_style} className={styles["gradient-text"]}>
      {children}
    </div>
  );
}

export default GradientText;
