import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/avatar/Avatar";
import { Button } from "../../components/button/Button";
import { Input } from "./../../components/input/Input";
import type { Comment, CommentInput } from "../../types/comment";
import { CurrentUserContext } from "../../contexts/contexts";
import useGetContext from "../../hooks/useGetContext";
import { useParams } from "react-router-dom";

export const CommentsPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const { currentUser } = useGetContext(CurrentUserContext);
  const { postId } = useParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedComment = newComment.trim();

    if (!trimmedComment) return;

    if (!currentUser || !postId) {
      console.error("User or post not found");
      return;
    }

    const comment: CommentInput = {
      postId: postId,
      message: trimmedComment,
      creationDate: new Date().toISOString(),
    };
  };

  return (
    <div
      className="bg-white border-2 border-pink-400 rounded-lg shadow-md flex flex-col"
      style={{ height: "calc(100vh - 12rem)" }}
    >
      <div className="p-4 border-b-2 border-pink-300">
        <h2 className="font-semibold text-gray-900">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h2>
      </div>

      {comments.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-500">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-700">No comments yet</p>
            <p className="text-sm">Be the first to comment!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <Avatar className="w-8 h-8 shrink-0 border-2 border-pink-400">
                <AvatarImage src={comment.user.imgUrl} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs">
                  {comment.user.username}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <p className="font-semibold text-sm text-gray-900">
                    {comment.user.username}
                  </p>
                  <p className="text-sm break-words text-gray-900">
                    {comment.message}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  {formatDate(comment.creationDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t-2 border-pink-300 p-4 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Avatar className="w-8 h-8 shrink-0 border-2 border-purple-500">
            <AvatarImage src={currentUser?.imgUrl} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
              {currentUser?.username}
            </AvatarFallback>
          </Avatar>
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border-2 border-purple-300 focus:border-purple-500 text-gray-900"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newComment.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
