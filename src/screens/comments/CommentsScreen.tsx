import axios from "axios";
import { MessageCircle, Send, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CustomAvatar } from "../../components/avatar/Avatar";
import { Button } from "../../components/button/Button";
import { CurrentUserContext } from "../../contexts/contexts";
import useGetContext from "../../hooks/useGetContext";
import { createComment, getComments } from "../../services/comments-api";
import type { Comment, CommentInput } from "../../types/comment";
import { formatDate } from "../../utils/formatDate";
import { Input } from "./../../components/input/Input";
import styles from "./CommentScreen.module.css";

const CommentsScreen = () => {
  const [inputValue, setInputValue] = useState("");
  const { currentUser } = useGetContext(CurrentUserContext);
  const { postId } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (postId) {
      const { response, abort } = getComments(postId);
      response
        .then(({ data }) => {
          setComments(data);
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
          } else {
            console.error("Failed to fetch comments:", error);
            setError("Failed to fetch comments");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });

      return abort;
    }
  }, [postId]);

  const handleSubmit = async () => {
    try {
      const trimmedComment = inputValue.trim();
      setInputValue("");

      if (trimmedComment) {
        if (!currentUser || !postId) {
          console.error("User or post not found");
        } else {
          const comment: CommentInput = {
            postId: postId,
            message: trimmedComment,
            creationDate: new Date().toISOString(),
          };

          const newComment = await createComment(comment);
          setComments((prevComments) => prevComments.concat(newComment));
        }
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  return !currentUser || isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h2>
      </div>

      {comments.length === 0 ? (
        <div className={styles.emptyState}>
          {error ? (
            <div className={styles.errorWrapper}>
              <div>{error}</div>
              <TriangleAlert />
            </div>
          ) : (
            <div className={styles.emptyStateContent}>
              <MessageCircle className={styles.emptyStateIcon} />
              <p className={styles.emptyStateText}>No comments yet</p>
              <p className={styles.emptyStateSubtext}>
                Be the first to comment!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment._id} className={styles.commentItem}>
              <CustomAvatar
                imgUrl={comment.user.imgUrl}
                username={comment.user.username}
              />
              <div className={styles.commentContent}>
                <div className={styles.commentBubble}>
                  <p className={styles.commentAuthor}>
                    {comment.user.username}
                  </p>
                  <p className={styles.commentText}>{comment.message}</p>
                </div>
                <p className={styles.commentDate}>
                  {formatDate(comment.creationDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.commentInputWrapper}>
        <CustomAvatar
          imgUrl={currentUser.imgUrl}
          username={currentUser.username}
        />
        <Input
          value={inputValue}
          placeholder="Add a comment..."
          className={styles.inputField}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!inputValue.trim()}
          onClick={handleSubmit}
        >
          <Send className={styles.submitIcon} />
        </Button>
      </div>
    </div>
  );
};

export default CommentsScreen;
