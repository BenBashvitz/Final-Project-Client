import { DevTool } from "@hookform/devtools";
import * as LabelPrimitive from "@radix-ui/react-label";
import { FormProvider, useForm } from "react-hook-form";
import { editPost, uploadPost } from "../../../services/posts-api";
import type { Post, PostFormValues } from "../../../types/post";
import { getDefaultValues } from "../../../utils/postDialog/getDefaultValues";
import { Button } from "../../button/Button";
import FileSelectorWrapper from "../../fileSelectorWrapper/FileSelectorWrapper";
import FormFieldErrorWrapper from "../../formFieldErrorWrapper/FormFieldErrorWrapper";
import styles from "./postForm.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostFormSchema } from "../../../schemas/postFormSchema";

type PostFormProps = {
  post?: Post;
  onClose: () => void;
  onCreate?: (post: Post) => void;
  onEdit?: (post: Post) => void;
};

const PostForm = ({ post, onClose, onCreate, onEdit }: PostFormProps) => {
  const data = useForm<PostFormValues>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: getDefaultValues(post),
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = data;

  const onSubmit = async ({ description, img }: PostFormValues) => {
    try {
      if (onEdit && post) {
        const editedPost = await editPost({ description, img }, post);

        onEdit(editedPost);
      } else if (img instanceof File) {
        const newPost = await uploadPost({ description, img });
        onCreate?.(newPost);
      } else {
        console.error("No image file provided");
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
              className={`${styles.textarea} ${errors.description ? styles.error : ""}`}
            />
          </div>
        </FormFieldErrorWrapper>

        <FileSelectorWrapper />

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{post ? "Update" : "Post"}</Button>
        </div>
      </form>
      <DevTool control={control} />
    </FormProvider>
  );
};

export default PostForm;
