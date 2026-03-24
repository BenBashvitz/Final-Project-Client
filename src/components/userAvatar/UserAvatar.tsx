import { Avatar, AvatarFallback, AvatarImage } from "../avatar/Avatar";

type AvatarCustomProps = {
  imgUrl?: string;
  username: string;
};

export const UserAvatar = ({ imgUrl, username }: AvatarCustomProps) => {
  return (
    <Avatar>
      <AvatarImage src={imgUrl} />
      <AvatarFallback>{username}</AvatarFallback>
    </Avatar>
  );
};
