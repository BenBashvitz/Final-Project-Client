import * as DialogPrimitive from "@radix-ui/react-dialog";
import DialogContent from "../dialog/Dialog.tsx";
import ProfileForm from './profileForm/ProfileForm.tsx'
import type {ProfileUpdate, User} from "../../types";

type ProfileDialogProps = {
    open: boolean;
    onClose: () => void;
    user: Omit<User, "password">;
    onSubmit: (user: ProfileUpdate) => void;
}

export const ProfileDialog = ({
                                  open,
                                  onClose,
                                  onSubmit,
                                  user,
                              }: ProfileDialogProps) => {
    return <DialogPrimitive.Root open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
            <DialogPrimitive.Title
                className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Edit Profile
            </DialogPrimitive.Title>
            <ProfileForm onClose={onClose} onSubmit={onSubmit} user={user} />
        </DialogContent>
    </DialogPrimitive.Root>

}