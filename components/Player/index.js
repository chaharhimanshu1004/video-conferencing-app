import ReactPlayer from "react-player";
import cx from "classnames";
import styles from "@/components/Player/index.module.css";
import { Mic, MicOff, UserSquare2 } from "lucide-react";
const Player = (props) => {
  const { url, muted, playing, isHighlighted } = props;
  return (
    <div
      className={cx(styles.playerContainer, {
        [styles.notActive]: !isHighlighted,
        [styles.active]: isHighlighted,
        [styles.notPlaying]: !playing,
      })}
    >
      {playing ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          width="100%"
          height="100%"
        />
      ) : (
        <UserSquare2 className={styles.user} size={isHighlighted ? 400 : 150} />
      )}

      {!isHighlighted ? (
        muted ? (
          <MicOff className={styles.icon} size={20} />
        ) : (
          <Mic className={styles.icon} size={20} />
        )
      ) : undefined}
    </div>
  );
};
export default Player;
