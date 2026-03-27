import {FormProvider, useForm} from "react-hook-form";
import type {ProfileFormValues, ProfileUpdate, User} from "../../../types";
import {zodResolver} from "@hookform/resolvers/zod";
import {ProfileFormSchema} from "../../../schemas/profileFormSchema.ts";
import {editProfile} from "../../../services/user-api.ts";
import {Button} from "../../button/Button.tsx";
import * as LabelPrimitive from "@radix-ui/react-label";
import {Input} from "../../input/Input.tsx";
import FileSelectorWrapper from "../../fileSelectorWrapper/FileSelectorWrapper.tsx";
import styles from "./ProfileForm.module.css";
import FormFieldErrorWrapper from "../../formFieldErrorWrapper/FormFieldErrorWrapper.tsx";

type ProfileFormProps = {
    user: Omit<User, "password">;
    onClose: () => void;
    onSubmit: (user: ProfileUpdate) => void;
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
        formState: {errors},
    } = data;

    const handleSubmission = async (profileForm: ProfileFormValues) => {
        try {
            const editedProfile = await editProfile(profileForm, user);
            onSubmit(editedProfile);
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <FormProvider {...data}>
            <form onSubmit={handleSubmit(handleSubmission)} className={styles.form}>
                <FileSelectorWrapper/>
                <FormFieldErrorWrapper error={errors.username?.message}>
                    <div className="formGroup">
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
                    </div>
                </FormFieldErrorWrapper>
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
        </FormProvider>
    )
}

export default ProfileForm;