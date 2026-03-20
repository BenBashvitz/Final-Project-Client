import { DevTool } from "@hookform/devtools";
import * as LabelPrimitive from "@radix-ui/react-label";
import { FormProvider, useForm } from "react-hook-form";
import { editPost, uploadPost } from "../../../services/posts-api";
import type { Post, PostFormValues } from "../../../types/post";
import { getDefaultValues } from "../../../utils/createPostDialog/getDefaultValues";
import { Button } from "../../button/Button";
import FileSelectorWrapper from "../../fileSelectorWrapper/FileSelectorWrapper";
import FormFieldErrorWrapper from "../../formFieldErrorWrapper/FormFieldErrorWrapper";
import styles from "./postForm.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostFormSchema } from "../../../schemas/postFormSchema";

type PostFormProps = {
  existingPost?: Post;
  onClose: () => void;
  onCreate?: (post: Post) => void;
  onEdit?: (post: Post) => void;
};

const PostForm = ({
  existingPost,
  onClose,
  onCreate,
  onEdit,
}: PostFormProps) => {
  const data = useForm<PostFormValues>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: getDefaultValues(existingPost),
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = data;

  const onSubmit = async (post: PostFormValues) => {
    try {
      if (onEdit && existingPost) {
        const editedPost = await editPost(post, existingPost);

        onEdit(editedPost);
      } else {
        const newPost = await uploadPost(post);
        onCreate?.(newPost);
      }
      onClose();
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  return (
    <FormProvider {...data}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormFieldErrorWrapper error={errors.description?.message}>
          <div className="formGroup">
            <LabelPrimitive.Root htmlFor="description">
              Caption
            </LabelPrimitive.Root>
            <textarea
              id="description"
              placeholder="What's on your mind?"
              {...register("description")}
              className={`${styles.textarea} ${errors.description && styles.error}`}
            />
          </div>
        </FormFieldErrorWrapper>

        <FileSelectorWrapper />

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className={styles.submitButton}>
            {existingPost ? "Update" : "Post"}
          </Button>
        </div>
      </form>
      <DevTool control={control} />
    </FormProvider>
  );
};

export default PostForm;
