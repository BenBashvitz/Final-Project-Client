import {useState} from 'react';
import {Camera, Grid3x3, Settings} from 'lucide-react';
import type {ProfileUpdate, User, UserContext} from "../../types";
import type {Post} from "../../types/post.ts";
import {Button} from "../../components/button/Button.tsx";
import {PostCard} from "../../components/postCard/PostCard.tsx";
import {ProfileDialog} from "../../components/profileDialog/ProfileDialog.tsx";
import {mergeItems} from "../../utils/merge.ts";
import {deletePost} from "../../services/posts-api.ts";
import {likePost, unlikePost} from "../../services/likes-api.ts";
import useGetContext from "../../hooks/useGetContext.ts";
import {CurrentUserContext} from "../../contexts/contexts.ts";
import {useNavigate} from "react-router-dom";
import {UserAvatar} from "../../components/userAvatar/UserAvatar.tsx";
import styles from './profileScreen.module.css'

const ProfileScreen = () => {
    const navigate = useNavigate();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const {currentUser, setCurrentUser} = useGetContext(CurrentUserContext);
    const [posts, setPosts] = useState<Post[]>([]);
    const assertUser = (user: UserContext["currentUser"]): Omit<User, 'password'> => {
        if (user) {
            return user;
        }

        console.error("Cannot show profile without a logged in user");
        navigate("/sign-in");

        return {
            _id: '',
            username: '',
            email: '',
            imgUrl: ''
        }
    }

    const user = assertUser(currentUser);

    const handleEditPost = (editedPost: Post) => {
        setPosts((prevPosts) => mergeItems(prevPosts, editedPost));
    };

    const handleDeletePost = async (postId: Post["_id"]) => {
        try {
            const {_id} = await deletePost(postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== _id));
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    const handleLikePost = async (post: Post) => {
        try {
            const updatedPost = post.isLikedByCurrentUser
                ? await unlikePost(post._id)
                : await likePost(post._id);

            setPosts((prevPosts) => mergeItems(prevPosts, updatedPost));
        } catch (error) {
            console.error("Failed to like post:", error);
        }
    };
    const handleUpdateUser = (profileUpdate: ProfileUpdate)=> {
        setCurrentUser(mergeItems([user], profileUpdate)[0])
    }

    return (
        <div className={styles.container}>
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
                                <Settings className="h-4 w-4 mr-2"/>
                                Edit Profile
                            </Button>
                        </div>

                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>{posts.length}</p>
                                <p className={styles.statLabel}>posts</p>
                            </div>
                        </div>

                        <p className={styles.emailText}>{user.email}</p>
                    </div>
                </div>
            </div>

            <div className={styles.gridHeader}>
                <div className={styles.gridTab}>
                    <Grid3x3/>
                    <span className={styles.gridTabText}>Posts</span>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className={styles.emptyState}>
                    <Camera className={styles.emptyIcon}/>
                    <p className="text-xl font-semibold text-gray-600 mb-2">No Posts Yet</p>
                    <p className="text-gray-500">
                        Share your first post!
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onEdit={handleEditPost}
                            onDelete={() => handleDeletePost(post._id)}
                            onLike={() => handleLikePost(post)}
                        />
                    ))}
                </div>
            )}

            <ProfileDialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} user={user}
                           onSubmit={handleUpdateUser}/>
        </div>
    );
}

export default ProfileScreen;