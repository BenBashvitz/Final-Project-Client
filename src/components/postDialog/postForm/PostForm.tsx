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
  onSubmit: (post: Post) => void;
};

const PostForm = ({ post, onClose, onSubmit }: PostFormProps) => {
  const data = useForm<PostFormValues>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: getDefaultValues(post),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = data;

  const handleSubmission = async ({ description, img }: PostFormValues) => {
    try {
      if (post) {
        const editedPost = await editPost({ description, img }, post);

        onSubmit(editedPost);
      } else if (img instanceof File) {
        const newPost = await uploadPost({ description, img });
        onSubmit(newPost);
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
      <form onSubmit={handleSubmit(handleSubmission)} className={styles.form}>
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
    </FormProvider>
  );
};

export default PostForm;
