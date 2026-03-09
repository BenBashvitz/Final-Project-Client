import type { Post } from "./post";

export type Cursor = {
  _id: Post["_id"];
  creationDate: Post["creationDate"];
};
