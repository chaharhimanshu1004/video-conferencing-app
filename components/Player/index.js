import ReactPlayer from 'react-player'
import cx from 'classnames'
import styles from '@/components/Player/index.module.css'
const Player = (props) =>{
    const {url,muted,playing,isHighlighted} = props;
    return (
        <div className={cx(styles.playerContainer,{
            [styles.notActive] : !isHighlighted,
            [styles.active] : isHighlighted,

        })}>
            <ReactPlayer url={url} muted={muted} playing={playing} width="100%" height="100%" />
        </div>
    )

}
export default Player;