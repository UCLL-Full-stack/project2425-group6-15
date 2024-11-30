import { User} from '../model/user'; 
import { PostInput, PostSummary, UserInput, UserSummary } from '../types';
import { ServiceError } from './service.error';
import postdb from '../repository/post.db';
import { Participant } from '../model/participant';
import participantService from './participant.service';
import userDb from '../repository/user.db';
import { Post } from '../model/post';
import activityDb from '../repository/activity.db';

const getPosts = async (): Promise<PostSummary[]> => {
    const posts = await postdb.getAll();
    if (!posts) {
        throw new ServiceError('Posts not found', 404);
    }
    let postSummaries: PostSummary[] = [];
    for (let post of posts) {
        let participants = await Promise.all(post.getparticipants().map(async participant => {
            let p = await participantService.getById(participant.getId());
            p.post = undefined;
            if (!p.user) {
                throw new ServiceError('User not found', 404);
            }
            return User.toSummary(p.user);
        }));
        let postSummary: PostSummary = {
            id: post.getId(),
            title: post.getTitle(),
            description: post.getDescription(),
            activity: post.getActivity(),
            creator: User.toSummary(post.getCreator()),
            participants: participants,
            startDate: post.getStartDate(),
            endDate: post.getEndDate(),
            time: post.getTime(),
            location: post.getLocation(),
            peopleNeeded: post.getPeopleNeeded(),
            preferredGender: 'male'
        };
        postSummaries.push(postSummary);
    }
    return postSummaries;
};
const createPost = async (post: PostInput, currentUser : User): Promise<PostSummary> => {
    let creator = currentUser;
    const activityId = post.activity.getId();
    if (activityId === undefined) {
        throw new ServiceError('Activity ID is undefined', 400);
    }
    let acitivity = await activityDb.getById(activityId);
    if (!acitivity) {
        throw new ServiceError('Activity not found', 404);
    }
    
    const newPost = new Post({
        title: post.title,
        description: post.description,
        startDate: post.startDate,
        endDate: post.endDate,
        time: post.time,
        location: post.location,
        activity: acitivity,
        creator: creator,
        participants: [],
        peopleNeeded: post.peopleNeeded,
        preferredGender: post.preferredGender
    });
    const createdPost = await postdb.create(newPost);
    const postSummary: PostSummary = {
        id: createdPost.getId(),
        title: createdPost.getTitle(),
        description: createdPost.getDescription(),
        activity: createdPost.getActivity(),
        creator: User.toSummary(createdPost.getCreator()),
        participants: [],
        startDate: createdPost.getStartDate(),
        endDate: createdPost.getEndDate(),
        time: createdPost.getTime(),
        location: createdPost.getLocation(),
        peopleNeeded: createdPost.getPeopleNeeded(),
        preferredGender: createdPost.getPreferredGender()
    };
    return postSummary;
};


export default {
    getPosts,
    createPost
};