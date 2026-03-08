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
  const isLiked = false; // Replace with actual logic to check if the current user has liked the post
  const userImgUrl = "https://www.freepik.com/free-photos-vectors/user";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar}>
            <AvatarImage src={userImgUrl} alt="avatarImg" />
            <AvatarFallback className={styles.avatarFallback}>
              {post.sender}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className={styles.senderName}>{post.sender}</p>
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
                isLiked ? styles.heartLiked : styles.heartUnliked,
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

        {post.description.length && (
          <div>
            <p className={styles.description}>
              <span className={styles.descriptionSender}>{post.sender}</span>
              {post.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
