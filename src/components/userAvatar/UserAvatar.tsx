import { Avatar, AvatarFallback, AvatarImage } from "../avatar/Avatar.tsx";

type AvatarCustomProps = {
  imgUrl?: string;
  username: string;
  className?: string;
  onClick?: () => void;
};

export const UserAvatar = ({ imgUrl, username, className, onClick }: AvatarCustomProps) => {
  return (
    <Avatar className={className} onClick={onClick}>
      <AvatarImage src={imgUrl} />
      <AvatarFallback>{username}</AvatarFallback>
    </Avatar>
  );
};
