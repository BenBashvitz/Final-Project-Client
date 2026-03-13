import { Heart, MessageCircle } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/avatar/avatar";
import { Button } from "../../../components/button/Button";
import { ImageWithFallback } from "../../../components/imageWithFallback/imageWithFallback";
import type { Post } from "../../../types/post";
import styles from "./postCard.module.css";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar}>
            <AvatarImage src={post.user.imgUrl} />
            <AvatarFallback className={styles.avatarFallback}>
              {post.user.username}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className={styles.senderName}>{post.user.username}</div>
            <div className={styles.dateText}>
              {formatDate(post.creationDate)}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.imageWrapper}>
        <ImageWithFallback
          src={post.imgUrl}
          alt="Post image"
          className={styles.image}
        />
      </div>

      <div className={styles.actions}>
        <div className={styles.actionRow}>
          {post.likeCount > 0 && (
            <span className={styles.countText}>{post.likeCount}</span>
          )}
          <Button variant="ghost" size="sm" className={styles.iconButton}>
            <Heart
              className={[
                styles.heartIcon,
                post.isLikedByCurrentUser
                  ? styles.heartLiked
                  : styles.heartUnliked,
              ].join(" ")}
            />
          </Button>
          {post.commentCount > 0 && (
            <span className={styles.countText}>{post.commentCount}</span>
          )}
          <Button variant="ghost" size="sm" className={styles.iconButton}>
            <MessageCircle className={styles.commentIcon} />
          </Button>
        </div>

        {post.description && (
          <div>
            <p className={styles.description}>
              <span className={styles.descriptionSender}>
                {post.user.username}
              </span>
              {post.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
