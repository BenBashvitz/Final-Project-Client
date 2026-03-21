import { Heart, MessageCircle } from "lucide-react";
import {
  Avatar,
  CustomAvatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/avatar/Avatar";
import { Button } from "../../../components/button/Button";
import { ImageWithFallback } from "../../../components/imageWithFallback/ImageWithFallback";
import { CurrentUserContext } from "../../../contexts/contexts";
import useGetContext from "../../../hooks/useGetContext";
import type { Post } from "../../../types/post";
import styles from "./postCard.module.css";
import PostOptions from "./postOptions/PostOptions";
import { formatDate } from "../../../utils/formatDate";

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
          {/* <Avatar className={styles.avatar}>
            <AvatarImage src={post.user.imgUrl} />
            <AvatarFallback className={styles.avatarFallback}>
              {post.user.username}
            </AvatarFallback>
          </Avatar> */}
          <CustomAvatar
            imgUrl={post.user.imgUrl}
            username={post.user.username}
          />
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
            <Button variant="ghost" size="sm" className={styles.iconButton}>
              <MessageCircle className={styles.commentIcon} />
            </Button>
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
