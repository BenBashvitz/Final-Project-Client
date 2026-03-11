import { DevTool } from "@hookform/devtools";
import * as LabelPrimitive from "@radix-ui/react-label";
import { FormProvider, useForm } from "react-hook-form";
import type { Post, PostFormValues } from "../../../types/post";
import { getDefaultValues } from "../../../utils/createPostDialog/getDefaultValues";
import { Button } from "../../button/Button";
import FileSelectorWrapper from "../../fileSelectorWrapper/FileSelectorWrapper";
import styles from "./postForm.module.css";
import { uploadPost } from "../../../services/posts-api";

type PostFormProps = {
  post?: Post;
  onClose: () => void;
  onCreatePost: (post: Post) => void;
};

const PostForm = ({ post, onClose, onCreatePost }: PostFormProps) => {
  const data = useForm<PostFormValues>({
    defaultValues: getDefaultValues(post),
  });
  const { register, handleSubmit, control } = data;

  const onSubmit = async (postToCreate: PostFormValues) => {
    try {
      const post = await uploadPost(postToCreate);

      onCreatePost(post);
      onClose();
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  return (
    <FormProvider {...data}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className="formGroup">
          <LabelPrimitive.Root htmlFor="description">
            Caption
          </LabelPrimitive.Root>
          <textarea
            id="description"
            placeholder="What's on your mind?"
            {...register("description", { required: true })}
            className={styles.textarea}
          />
        </div>

        <FileSelectorWrapper />

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className={styles.submitButton}>
            {post ? "Update" : "Post"}
          </Button>
        </div>
      </form>
      <DevTool control={control} />
    </FormProvider>
  );
};

export default PostForm;
