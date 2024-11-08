interface IPost {
  id: number;
  title: string;
  content: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  accToken?: string;
  comments?: IComment[];
  postPicture?: IPostPicture[];
  profileId: number;
  profile?: IProfile;
  likes?: ILike[];
}

interface IComment {
  id: number;
  content?: string;
  profileId?: number;
  postId?: number;
}

interface IFollow {
  id: number;
  followerId: number;
  followingId: number;
  following?: any;
}

interface IProgrammingLanguage {
  createdAt?: string;
  id: number;
  language: string;
  profileId: number;
  color?: string;
}

interface IPicture {
  id: number;
  profileId: number;
  avatarUrl: string;
  createdAt?: string;
  updatedAt?: string;
  accToken?: string;
}

interface IBGPicture {
  id: number;
  profileId: number;
  url: string;
  createdAt?: string;
  updatedAt?: string;
  accToken?: string;
}

interface IPostPicture {
  id: number;
  profileId: number;
  postId: number;
  url: string;
  createdAt?: string;
  updatedAt?: string;
  accToken?: string;
}

interface ILike {
  id: number;
  profileId: number;
  postId: number;
  createdAt?: string;
  accToken?: string;
}

interface IProfile {
  id: number;
  authorEmail: string;
  website: string;
  username: string;
  picture?: IPicture;
  bio: string;
  name?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  avatarUrl?: string;
  followers?: Follower[];
  backgroundPicture?: IBGPicture;
}

interface TodoProps {
  todo: IPost;
}

interface Follower {
  id: number;
  followerId: number;
  followingId: number;
  follower: any;
}

type ApiDataType = {
  message: string;
  status: string;
  posts?: IPost[];
  todo?: IPost;
  profile?: IProfile;
  picture?: IPicture;
  profiles: IProfile[];
};

type GetPostsResponse = {
  posts: IPost[];
};

interface ProtectedRouteProps {
  children: ReactNode;
  signedIn: boolean;
}

interface ProfilePageProps {
  childToParent?: boolean;
}

interface ReadMoreButtonProps {
  postId: number;
  commentTotal?: number;
}
