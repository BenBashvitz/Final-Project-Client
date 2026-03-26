import {Button} from "../button/Button.tsx";
import {Home, LogOut, PlusCircle} from "lucide-react";
import {logout} from "../../services/auth-api.ts";
import {useNavigate} from "react-router";
import useGetContext from "../../hooks/useGetContext.ts";
import {CurrentUserContext, LoadedPostsContext} from "../../contexts/contexts.ts";
import styles from "./Header.module.css";
import {useEffect, useState} from "react";
import {PostDialog} from "../postDialog/PostDialog.tsx";
import {UserAvatar} from "../userAvatar/UserAvatar.tsx";
import {useLocation} from "react-router-dom";

export const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {currentUser} = useGetContext(CurrentUserContext);
    const {setPosts} = useGetContext(LoadedPostsContext);
    const [hideHeader, setHideHeader] = useState(true);
    const [showPostCreationDialog, setShowPostCreationDialog] = useState(false);


    useEffect(() => {
        console.log(location.pathname === "/sign-in" || location.pathname === "/sign-up")
        setHideHeader(location.pathname === "/sign-in" || location.pathname === "/sign-up");
    }, [location]);

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
        } catch (error) {
            console.error("Error logging out ", error);
        } finally {
            navigate("/sign-in");
        }
    };

    const handleGoToHome = () => {
        navigate("/");
    }

    return (
        <>
            <header className={styles.header + ' ' + (hideHeader && styles.hide)}>
                <div className={styles.container}>
                    <div className={styles.wrapper}>
                        <div className={styles.logoSection}>
                            <div className={styles.logoIcon}>PY</div>
                            <span className={styles.logoText}>Postly</span>
                        </div>

                        <div className={styles.actionsSection}>
                            {
                                location.pathname === '/' ?
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => setShowPostCreationDialog(true)}
                                    >
                                        <PlusCircle size={16}/>
                                        <span className={styles.navLabel}>Create Post</span>
                                    </Button> : <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleGoToHome}
                                    >
                                        <Home size={16}/>
                                        <span className={styles.navLabel}>Home</span>
                                    </Button>
                            }

                            <div className={styles.divider}/>

                            <div className={styles.userSection}>
                                {
                                    currentUser && <div onClick={() => {
                                        navigate("/profile");
                                    }}>
                                        <UserAvatar className={styles.avatarContainer} username={currentUser.username} imgUrl={currentUser.imgUrl}/>
                                    </div>
                                }
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