import axios, { AxiosError, AxiosResponse } from 'axios';

const baseUrl: string = `${process.env.REACT_APP_BACKEND_URL}/api/v1/posts`;
const profileUrl: string = `${process.env.REACT_APP_BACKEND_URL}/api/v1/profile`;
const pictureUrl: string = `${process.env.REACT_APP_BACKEND_URL}/api/v1/picture`;
const postPictureUrl: string = `${process.env.REACT_APP_BACKEND_URL}/api/v1/post-picture`;
const likeUrl: string = `${process.env.REACT_APP_BACKEND_URL}/api/v1/like`;
const followUrl: string = `${process.env.REACT_APP_BACKEND_URL}/api/v1/follow`;
const commentUrl: string = `${process.env.REACT_APP_BACKEND_URL}/api/v1/comment`;

export async function getProfiles() {
  const { data } = await axios.get(profileUrl);
  return data;
}

export async function fetchPosts() {
  const { data } = await axios.get(baseUrl);
  return data;
}

export async function fetchPostsByProfileId(id: number): Promise<AxiosResponse> {
  try {
    const response: AxiosResponse<ApiDataType> = await axios.get(baseUrl + '/post/byProfileId/' + id);
    return response;
  } catch (error: any) {
    throw new AxiosError(error);
  }
}

export const getPost = async (id: number): Promise<AxiosResponse> => {
  const response: AxiosResponse<ApiDataType> = await axios.get(baseUrl + '/post/' + id);
  return response;
};

export const getProfileByAuthorEmail = async (authorEmail: string): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse<ApiDataType> = await axios.get(`${profileUrl}/findProfileByEmail/${authorEmail}`);
    return response;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const getProfileText = async (text: string): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse<ApiDataType> = await axios.get(`${profileUrl}/searchProfile/${text}`);
    return response;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const getFollowingCount = async (profileId: number): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse<ApiDataType> = await axios.get(`${followUrl}/following-count/${profileId}`);
    return response;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export async function addPost(post: Omit<IPost, 'id'>, accToken: string) {
  const response = await axios.post(`${baseUrl}/create`, post, { headers: { Authorization: `token ${accToken}` } });
  return response;
}

export async function addFollow(post: Omit<IFollow, 'id'>, accToken: string) {
  const response = await axios.post(`${followUrl}/create`, post, { headers: { Authorization: `token ${accToken}` } });
  return response;
}

export async function unFollow(post: Omit<IFollow, 'id'>, accToken: string) {
  const response = await axios.post(`${followUrl}/deleteById`, post, {
    headers: { Authorization: `token ${accToken}` }
  });
  return response;
}

export const deleteTodo = async (id: number): Promise<AxiosResponse> => {
  try {
    const deletedTodo: AxiosResponse<ApiDataType> = await axios.delete(`${baseUrl}/delete-todo/${id}`);
    return deletedTodo;
  } catch (error: any) {
    throw new Error(error);
  }
};

export async function createProfile(profile: Omit<IProfile, 'id'>) {
  const response = await axios.post(`${profileUrl}/create`, profile);
  return response;
}

export async function saveProfile(profile: IProfile) {
  const response = await axios.put(`${profileUrl}/updateById/${profile.id}`, profile);
  return response;
}

export async function publishProfile(profileId: number) {
  const response = await axios.put(`${profileUrl}/publishProfile/${profileId}`);
  return response;
}

export async function createPicture(picture: Omit<IPicture, 'id'>, accToken: string) {
  const response = await axios.post(`${pictureUrl}/create`, picture, {
    headers: { Authorization: `token ${accToken}` }
  });
  return response;
}

export async function createPostPicture(picture: Omit<IPostPicture, 'id'>, accToken: string) {
  const response = await axios.post(`${postPictureUrl}/create`, picture, {
    headers: { Authorization: `token ${accToken}` }
  });
  return response;
}

export async function updatePicture(picture: Omit<IPicture, 'id'>, accToken: string) {
  const response = await axios.put(`${pictureUrl}/update`, picture, {
    headers: { Authorization: `token ${accToken}` }
  });
  return response;
}

export async function getPictureByProfileId(profileId: number) {
  const response = await axios.get(`${pictureUrl}/pictureByProfileId/${profileId}`);
  return response;
}

export async function addLike(like: Omit<ILike, 'id'>, accToken: string) {
  const response = await axios.post(`${likeUrl}/create`, like, {
    headers: { Authorization: `token ${accToken}` }
  });
  return response;
}

export async function addComment(comment: Omit<IComment, 'id'>, accToken: string) {
  const response = await axios.post(`${commentUrl}/create`, comment, {
    headers: { Authorization: `token ${accToken}` }
  });
  return response;
}
