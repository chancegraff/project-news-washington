import React from 'react';
import cx from "classnames";
import styles from './index.module.scss';
import VoteSvg from './VoteSvg';

const Upvoter: React.FC<{
  className: string;
  hasVoted: boolean | undefined;
  handleVote: () => void;
  canVote: boolean | undefined;
}> = ({
  className,
  hasVoted,
  handleVote,
  canVote,
}) => {
    return (
      <button className={cx({
        [className]: true,
        [styles.VoteButton]: true,
        [styles.HasVoted]: hasVoted,
        [styles.CantVote]: !canVote,
      })} onClick={handleVote}>
        <VoteSvg className={styles.VoteSvg} />
      </button>
    );
  }

export default Upvoter;
