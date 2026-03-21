import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Post } from "../../../types/post";
import { Button } from "../../button/Button";
import { PostDialog } from "../../postDialog/PostDialog";
import styles from "./postOptions.module.css";

type PostOptionsProps = {
  onEdit: (post: Post) => void;
  onDelete: () => void;
  post?: Post;
};

const PostOptions = ({ onEdit, onDelete, post }: PostOptionsProps) => {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <Button variant="ghost" size="sm" className={styles.moreButton}>
            <MoreVertical className={styles.moreButtonIcon} />
          </Button>
        </DropdownMenuPrimitive.Trigger>
        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            data-slot="dropdown-menu-content"
            sideOffset={4}
            className={styles.dropdownContent}
            align="end"
          >
            <DropdownMenuPrimitive.Item
              onClick={() => setIsPostDialogOpen(true)}
              className={styles.dropdownItem}
            >
              <Pencil className={styles.dropdownIcon} />
              Edit
            </DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Item
              onClick={onDelete}
              className={`${styles.dropdownItem} ${styles.dropdownItemDelete}`}
            >
              <Trash2 className={styles.dropdownIcon} />
              Delete
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>

      <PostDialog
        onClose={() => setIsPostDialogOpen(false)}
        open={isPostDialogOpen}
        onEdit={onEdit}
        post={post}
      />
    </>
  );
};

export default PostOptions;
