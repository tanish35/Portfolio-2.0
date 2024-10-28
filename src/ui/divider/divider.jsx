import { classes, cssProps, numToMs } from "@/utils/style";
import styles from "./divider.module.css";

export const Divider = ({ collapseDelay, collapsed }) => (
  <div className={classes(styles.divider)}>
    <div className={styles.line} data-collapsed={collapsed} />
    <div
      className={styles.notch}
      style={cssProps({ collapseDelay: numToMs(collapseDelay + 160) })}
    />
  </div>
);
