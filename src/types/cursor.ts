import type { Post } from "./post";

export type Cursor = {
  _id: Post["_id"] | null;
  creationDate: Post["creationDate"] | null;
};
