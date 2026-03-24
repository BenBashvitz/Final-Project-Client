import {Button} from "../button/Button.tsx";
import {LogOut, PlusCircle} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "../avatar/avatar";
import {logout} from "../../services/auth-api.ts";
import {useNavigate} from "react-router";
import useGetContext from "../../hooks/useGetContext.ts";
import {CurrentUserContext, LoadedPostsContext} from "../../contexts/contexts.ts";

import styles from "./Header.module.css";
import {useState} from "react";
import {PostDialog} from "../postDialog/postDialog.tsx";

export const Header = () => {
    const navigate = useNavigate();
    const {currentUser} = useGetContext(CurrentUserContext);
    const {setPosts} = useGetContext(LoadedPostsContext);
    const [showPostCreationDialog, setShowPostCreationDialog] = useState(false);

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
        } catch (error) {
            console.error("Error logging out ", error);
        } finally {
            navigate("/sign-in");
        }
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.wrapper}>
                        <div className={styles.logoSection}>
                            <div className={styles.logoIcon}>PY</div>
                            <span className={styles.logoText}>Postly</span>
                        </div>

                        <div className={styles.actionsSection}>
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => setShowPostCreationDialog(true)}
                            >
                                <PlusCircle size={16}/>
                                <span className={styles.navLabel}>Create Post</span>
                            </Button>

                            <div className={styles.divider}/>

                            <div className={styles.userSection}>
                                <Avatar className={styles.avatarContainer}>
                                    <AvatarImage src={currentUser?.imgUrl} alt={currentUser?.username}/>
                                    <AvatarFallback className={styles.avatarFallback}>
                                        {currentUser?.username?.[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className={styles.logoutButton}
                                >
                                    <LogOut size={16}/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <PostDialog
                open={showPostCreationDialog}
                onClose={() => setShowPostCreationDialog(false)}
                onSubmit={(post) => setPosts((prev) => [post].concat(prev))}
            />
        </>
    );
};