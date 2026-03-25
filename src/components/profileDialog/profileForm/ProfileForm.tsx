import { FormProvider, useForm } from "react-hook-form";
import type { ProfileFormValues, User } from "../../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormSchema } from "../../../schemas/profileFormSchema.ts";
import { editProfile } from "../../../services/user-api.ts";
import { Button } from "../../button/Button.tsx";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Input } from "../../input/Input.tsx";
import FileSelectorWrapper from "../../fileSelectorWrapper/FileSelectorWrapper.tsx";
import { DevTool } from "@hookform/devtools";

// Import styles
import styles from "./ProfileForm.module.css";

type ProfileFormProps = {
    user: Omit<User, "password">;
    onClose: () => void;
    onSubmit: (user: User) => void;
}

const ProfileForm = ({user, onClose, onSubmit}: ProfileFormProps) => {
    const data = useForm<ProfileFormValues>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            username: user.username,
            img: user.imgUrl
        }
    });

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = data;

    const handleSubmission = async ({username, img}: ProfileFormValues) => {
        try {
            const editedProfile = await editProfile({username, img}, user);
            onSubmit(editedProfile);
            onClose();
        } catch (error) {
            console.error("Image upload failed:", error);
        }
    };

    return (
        <FormProvider {...data}>
            <form onSubmit={handleSubmit(handleSubmission)} className={styles.form}>
                <div className={styles.fieldGroup}>
                    <FileSelectorWrapper/>
                </div>

                <div className={styles.fieldGroup}>
                    <LabelPrimitive.Root
                        htmlFor="edit-username"
                        className={styles.label}
                    >
                        Username
                    </LabelPrimitive.Root>
                    <Input
                        id="edit-username"
                        {...register("username")}
                        className={styles.inputField}
                    />
                    {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
                </div>

                <div className={styles.fieldGroup}>
                    <LabelPrimitive.Root
                        htmlFor="edit-email"
                        className={styles.label}
                    >
                        Email
                    </LabelPrimitive.Root>
                    <Input
                        id="edit-email"
                        type="email"
                        className={styles.inputField}
                    />
                </div>

                <div className={styles.actions}>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
            <DevTool control={control} />
        </FormProvider>
    )
}

export default ProfileForm;