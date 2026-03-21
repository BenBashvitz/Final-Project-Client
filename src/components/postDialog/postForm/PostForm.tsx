import { DevTool } from "@hookform/devtools";
import * as LabelPrimitive from "@radix-ui/react-label";
import { FormProvider, useForm } from "react-hook-form";
import { uploadPost } from "../../../services/posts-api";
import type { Post, PostFormValues } from "../../../types/post";
import { getDefaultValues } from "../../../utils/createPostDialog/getDefaultValues";
import { Button } from "../../button/Button";
import FileSelectorWrapper from "../../fileSelectorWrapper/FileSelectorWrapper";
import FormFieldErrorWrapper from "../../formFieldErrorWrapper/FormFieldErrorWrapper";
import styles from "./postForm.module.css";

type PostFormProps = {
  post?: Post;
  onClose: () => void;
  onCreatePost: (post: Post) => void;
};

const PostForm = ({ post, onClose, onCreatePost }: PostFormProps) => {
  const data = useForm<PostFormValues>({
    defaultValues: getDefaultValues(post),
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = data;

  const onSubmit = async ({ description, img }: PostFormValues) => {
    try {
      if (img) {
        const post = await uploadPost({ description, img });

        onCreatePost(post);
        onClose();
      } else {
        console.error("No image file provided");
        setError("img", { message: "Image is required" });
      }
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
              {...register("description", {
                required: {
                  value: true,
                  message: "Description is required",
                },
              })}
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
