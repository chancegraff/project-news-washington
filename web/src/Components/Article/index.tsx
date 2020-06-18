import React, { useState, useMemo, useCallback } from 'react';
import Upvoter from "../Upvoter";
import styles from './index.module.scss';

const voteURL = "/api/v1/ranks/vote"

const Article: React.FC<{
  article: IArticle;
  user: IUser | undefined;
}> = ({
  article,
  user,
}) => {
    const articleVotes = useMemo(() => localStorage.getItem(article.id.toString()) || "[]", [article]);
    const [votes, setVotes] = useState<Array<string>>(JSON.parse(articleVotes));
    const source = useMemo(() => {
      if(article.url) {
        const url = new URL(article.url);
        return url.hostname;
      }
    }, [
      article,
    ]);

    const {
      publishedDate,
      publishedTime,
    } = useMemo(() => {
      const publishedAt = new Date(article.publishedAt)
      return {
        publishedDate: publishedAt.toLocaleDateString(),
        publishedTime: publishedAt.toLocaleTimeString(),
      }
    }, [
      article,
    ]);

    const canVote = useMemo<boolean | undefined>(() => (
      Boolean(user)
    ), [
      user
    ]);

    const hasVoted = useMemo<boolean | undefined>(() => (
      user && votes.includes(user.id.toString())
    ), [
      votes,
      user,
    ]);

    const handleVote = useCallback(() => {
      if(user) {
        const options = {
          method: "POST",
          body: JSON.stringify({
            article: `${article.id}`,
            user: `${user.id}`,
          }),
        }

        fetch(voteURL, options)
          .then((res) => res.json())
          .then((users) => {
            localStorage.setItem(article.id.toString(), JSON.stringify(users || []))
            setVotes(users || []);
          });
      }
    }, [
      article,
      user,
    ]);

    return (
      <div className={styles.Article}>
        <Upvoter
          className={styles.ArticleUpvoter}
          hasVoted={hasVoted}
          handleVote={handleVote}
          canVote={canVote}
        />
        <img className={styles.ArticleImage} src={article.thumbnail} />
        <div className={styles.ArticleText}>
          <a className={styles.ArticleLink} href={article.url} rel="noopener noreferrer" target="_blank">{article.title}</a>
          <div className={styles.ArticleSmallText}>
            <a className={styles.ArticleSource} href={`https://${source}`} rel="noopener noreferrer" target="_blank">{source}</a>
            <span className={styles.ArticlePublishedDate}>{publishedDate}</span>
            <span className={styles.ArticlePublishedTime}>{publishedTime}</span>
          </div>
        </div>
      </div>
    );
  }

export default Article;
