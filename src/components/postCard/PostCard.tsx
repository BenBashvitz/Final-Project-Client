import { Heart, MessageCircle } from "lucide-react";
import { CurrentUserContext } from "../../contexts/contexts";
import useGetContext from "../../hooks/useGetContext";
import type { Post } from "../../types/post";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../button/Button";
import { ImageWithFallback } from "../imageWithFallback/ImageWithFallback";
import styles from "./postCard.module.css";
import PostOptions from "./postOptions/PostOptions";
import { Link } from "react-router-dom";
import { UserAvatar } from "../userAvatar/UserAvatar";

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: () => void;
  onLike: () => void;
}

export const PostCard = ({ post, onEdit, onDelete, onLike }: PostCardProps) => {
  const { currentUser } = useGetContext(CurrentUserContext);

  const isOwnPost = post.user._id === currentUser?._id;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <UserAvatar imgUrl={post.user.imgUrl} username={post.user.username} />
          <div>
            <div className={styles.senderName}>{post.user.username}</div>
            <div className={styles.dateText}>
              {formatDate(post.creationDate)}
            </div>
          </div>
        </div>
        {isOwnPost && (
          <PostOptions onEdit={onEdit} post={post} onDelete={onDelete} />
        )}
      </div>

      <ImageWithFallback
        src={post.imgUrl}
        alt="Post image"
        className={styles.image}
      />

      <div className={styles.actions}>
        <div className={styles.actionRow}>
          <div className={styles.action}>
            {post.likeCount > 0 && (
              <span className={styles.countText}>{post.likeCount}</span>
            )}
            <Button variant="ghost" size="sm" className={styles.iconButton}>
              <Heart
                onClick={onLike}
                className={[
                  styles.heartIcon,
                  post.isLikedByCurrentUser
                    ? styles.heartLiked
                    : styles.heartUnliked,
                ].join(" ")}
              />
            </Button>
          </div>
          <div className={styles.action}>
            {post.commentCount > 0 && (
              <span className={styles.countText}>{post.commentCount}</span>
            )}
            <Link
              to={`/posts/${post._id}/comments`}
              className={styles.iconButton}
            >
              <MessageCircle className={styles.commentIcon} />
            </Link>
          </div>
        </div>

        <div>
          <p className={styles.description}>
            <span className={styles.descriptionSender}>
              {post.user.username}
            </span>
            {post.description}
          </p>
        </div>
      </div>
    </div>
  );
};
