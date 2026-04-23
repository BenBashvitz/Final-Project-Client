import {useEffect, useState} from 'react';
import {Grid3x3, Settings} from 'lucide-react';
import type {ProfileUpdate} from "../../types";
import {Button} from "../../components/button/Button.tsx";
import {ProfileDialog} from "../../components/profileDialog/ProfileDialog.tsx";
import useGetContext from "../../hooks/useGetContext.ts";
import {CurrentUserContext, LoadedPostsContext} from "../../contexts/contexts.ts";
import {UserAvatar} from "../../components/userAvatar/UserAvatar.tsx";
import styles from './profileScreen.module.css'
import Feed from '../../components/feed/Feed.tsx';
import {useInfiniteFeed} from "../../hooks/useInfiniteScroll.ts";
import {getPostCountForCurrentUser, getPosts} from "../../services/posts-api.ts";

const ProfileScreen = () => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const {currentUser, setCurrentUser} = useGetContext(CurrentUserContext);
    const {cursor, loadMore, isLoading, initialFetchError, fetchMoreError} = useInfiniteFeed(
        (cursor) => getPosts(cursor, currentUser?._id),
        [currentUser]
    );
    const {currentUserPostsCount, setCurrentUserPostsCount} = useGetContext(LoadedPostsContext);
    const [currentUserPostsError, setCurrentUserPostsError] = useState<string | null>(null)
    const user = currentUser ?? {
        _id: "",
        username: "",
        email: "",
    }

    useEffect(() => {
        getPostCountForCurrentUser().then((count) => {
            setCurrentUserPostsCount(count);
        }).catch(() => {
            setCurrentUserPostsError("Error fetching current user post count");
        })
    }, []);

    const handleUpdateUser = (profileUpdate: ProfileUpdate) => {
        setCurrentUser((prevCurrentUser) => prevCurrentUser ? {
            ...prevCurrentUser,
            ...profileUpdate,
        } : null)
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <UserAvatar className={styles.avatarLarge} username={user.username} imgUrl={user.imgUrl}/>

                        <div className={styles.infoSection}>
                            <div className={styles.titleRow}>
                                <h2 className={styles.username}>{user.username}</h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditDialogOpen(true)}
                                    className={styles.editButton}
                                >
                                    <Settings className={styles.settings}/>
                                    Edit Profile
                                </Button>
                            </div>

                            <div className={styles.statsRow}>
                                <div className={styles.statItem}>
                                    {
                                        currentUserPostsError
                                            ? <p className={styles.statValue}>{
                                                currentUserPostsError
                                            }</p>
                                            : <>
                                                <p className={styles.statValue}>{
                                                    currentUserPostsCount
                                                }</p>
                                                <p className={styles.statLabel}>posts</p>
                                            </>
                                    }

                                </div>
                            </div>

                            <p className={styles.emailText}>{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.gridTab}>
                    <Grid3x3/>
                    <span className={styles.gridTabText}>Posts</span>
                </div>
            </div>

            <Feed
                hasMore={!!cursor}
                onLoadMore={loadMore}
                isLoading={isLoading}
                initialFetchError={initialFetchError}
                fetchMoreError={fetchMoreError}
            />

            <ProfileDialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} user={user}
                           onSubmit={handleUpdateUser}/>
        </div>
    );
}

export default ProfileScreen;