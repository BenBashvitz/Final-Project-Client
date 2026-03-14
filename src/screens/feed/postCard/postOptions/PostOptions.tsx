import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../components/button/Button";
import styles from "./postOptions.module.css";
import { PostDialog } from "../../../../components/postDialog/PostDialog";
import type { Post } from "../../../../types/post";

type PostOptionsProps = {
  onEdit?: (post: Post) => void;
  post?: Post;
};

const PostOptions = ({ onEdit, post }: PostOptionsProps) => {
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
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
      {
        <PostDialog
          onClose={() => setIsPostDialogOpen(false)}
          open={isPostDialogOpen}
          onEdit={onEdit}
          post={post}
        />
      }
    </>
  );
};

export default PostOptions;
