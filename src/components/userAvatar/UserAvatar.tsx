import { Avatar, AvatarFallback, AvatarImage } from "../avatar/Avatar.tsx";

type AvatarCustomProps = {
  imgUrl?: string;
  username: string;
  className?: string;
};

export const UserAvatar = ({ imgUrl, username, className }: AvatarCustomProps) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={imgUrl} />
      <AvatarFallback>{username}</AvatarFallback>
    </Avatar>
  );
};
