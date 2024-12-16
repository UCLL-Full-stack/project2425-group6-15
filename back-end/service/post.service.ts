import { User} from '../model/user'; 
import { PostInput, PostPrevieuw, PostSummary, UserInput, UserSummary } from '../types';
import { ServiceError } from './service.error';
import postdb from '../repository/post.db';
import { Post } from '../model/post';
import activityDb from '../repository/activity.db';
import { log } from 'console';

const getAllPosts = async (currentUser : User): Promise<PostPrevieuw[]> => {
    if (currentUser.getRole() == 'organization') {
        throw new ServiceError('You dont have permission.', 403);
    }
    const posts = await postdb.getAll();
    if (!posts) {
        throw new ServiceError('Posts not found', 404);
    }
    const postSummaries: PostPrevieuw[] = posts.map((post) => {
        if (post.getCreator().getId() != currentUser.getId()) {
            return post.toPrevieuw(currentUser.getId());
        }
        return undefined;
    }).filter((post): post is PostPrevieuw => post !== undefined);
    return postSummaries;
}; 

const getCurrentUserPosts = async (currentUser : User): Promise<PostPrevieuw[]> => {
    if (currentUser.getRole() != 'user') {
        throw new ServiceError('Only users can have posts', 403);
    }
    const posts = await postdb.getAll();
    if (!posts) {
        throw new ServiceError('Posts not found', 404);
    }
    const postSummaries: PostPrevieuw[] = posts.map((post) => {
        if (post.getCreator().getId() === currentUser.getId()) {
            return post.toPrevieuw(currentUser.getId());
        }
        return undefined;
    }).filter((post): post is PostPrevieuw => post !== undefined);
    return postSummaries;
}; 

const getPostById = async (id: number, currentUser : User): Promise<PostSummary> => {
    const post = await postdb.getById(id);
    if (!post) {
        throw new ServiceError('Post not found', 404);
    }
    return post.toSummary();
};
const createPost = async (post: PostInput, currentUser : User): Promise<PostSummary> => {
    if (currentUser.getRole() != 'user' || currentUser.getRole() != 'organization') {
        throw new ServiceError('Only users can create posts', 403);
    }
    let creator = currentUser;
    const activityId = post.activity.getId();
    if (activityId === undefined) {
        throw new ServiceError('Activity ID is undefined', 400);
    }
    let acitivity = await activityDb.getById(activityId);
    if (!acitivity) {
        throw new ServiceError('Activity not found', 404);
    }
    
    post.creator = currentUser;
    const newpost = Post.fromPostInput(post);
    const savedpost = await postdb.create(newpost);
    const postSummary = savedpost.toSummary();
    return postSummary;
};

const joinPost = async (id: number, currentUser: User): Promise<PostSummary> => {
    if (currentUser.getRole() != 'user') {
        throw new ServiceError('Only users can join posts', 403);
    }

    const post = await postdb.getById(id);
    if (!post) {
        throw new ServiceError('Post not found', 404);
    }
    if (post.getCreator().getId() === currentUser.getId()) {
        throw new ServiceError('Creator cannot join own post', 400);
    }
    if (post.getParticipants().some(participant => participant.getId() === currentUser.getId())) {
        throw new ServiceError('User already joined post', 400);
    }
    if (post.isFull()) {
        throw new ServiceError('Post is full', 400);
    }

    post.addParticipant(currentUser);
    log(post);
    const updatedPost = await postdb.update(post);

    return updatedPost.toSummary();
};

export default {
    getAllPosts,
    getCurrentUserPosts,
    createPost,
    joinPost,
    getPostById
};