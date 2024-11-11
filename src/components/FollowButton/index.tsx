import { Button, useToast } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addFollow, getFollowingCount, getProfileByAuthorEmail, unFollow } from '../../api';
import { useAuthStore } from '../../store/auth';

export const FollowButton = ({ followingId, user }: any) => {
  const toast = useToast();

  const [followStatus, setFollowStatus] = useState('follow');

  const { user: session, profileId, setProfileFollowing, setProfileGlobal } = useAuthStore();

  console.log(followingId);

  const createFollow = async (): Promise<AxiosResponse> => {
    const post: Omit<IFollow, 'id'> = {
      followerId: profileId!,
      followingId: followingId
    };
    return await addFollow(post, session?.access_token!);
  };

  const unFollowProfile = async (): Promise<AxiosResponse> => {
    const post: Omit<IFollow, 'id'> = {
      followerId: profileId!,
      followingId: followingId
    };
    return await unFollow(post, session?.access_token!);
  };

  const checkFollowStatus = (user: IProfile, followerId: number) => {
    const isFollowing = user?.followers?.some(follower => follower.followerId === followerId);

    return setFollowStatus(isFollowing ? 'Unfollow' : 'Follow');
  };

  const queryClient = useQueryClient();

  const fetchProfileFollowing = async () => {
    const res: AxiosResponse<ApiDataType> = await getFollowingCount(profileId);
    return res.data;
  };

  const fetchProfile = async () => {
    const res: AxiosResponse<ApiDataType> = await getProfileByAuthorEmail(user?.email!);
    return res.data;
  };

  const {
    data: profileData,
    error: profileError,
    isLoading: isFetchingProfile,
    refetch: refetchProfile
  } = useQuery(['profileDetail'], fetchProfile, {
    enabled: false,
    retry: 2,
    cacheTime: 0,
    onSuccess(res: IProfile) {
      queryClient.invalidateQueries(['profileDetail']);
      queryClient.invalidateQueries(['profileFollowing']);
      if (res != null) {

         setProfileGlobal(res);
      }
      
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        position: 'top',
        variant: 'subtle',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const { refetch: refetchProfileFollowing } = useQuery(['profileFollowing'], fetchProfileFollowing, {
    enabled: false,
    retry: 0,
    cacheTime: 0,
    onSuccess(res: any) {
      // setPicture(res)
      setProfileFollowing(res);
      queryClient.invalidateQueries(['profileFollowing']);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        position: 'top',
        variant: 'subtle',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const { mutate: postFollow } = useMutation(createFollow, {
    onSuccess(res) {
      toast({
        title: 'Success Follow',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      refetchProfile();
      refetchProfileFollowing();
      queryClient.invalidateQueries(['profile']);
      queryClient.invalidateQueries(['profileFollowing']);

      window.location.reload();
    }
  });

  const { mutate: postUnfollow } = useMutation(unFollowProfile, {
    onSuccess(res) {
      toast({
        title: 'Unfollow Selected Profile',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      refetchProfile();
      refetchProfileFollowing();

      queryClient.invalidateQueries(['profile']);
      queryClient.invalidateQueries(['profileFollowing']);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  });

  useEffect(() => {
    if (user) {
      refetchProfileFollowing();
      refetchProfile();

    }
    checkFollowStatus(user, profileId);
  }, [user, refetchProfileFollowing,  refetchProfile, profileId ]);

  function handleFollowCallback(): void {
    postUnfollow();
  }

  function handleUnfollowCallback(): void {
    postFollow();
  }
  return (
    <Button
      variant={'outline'}
      color={'white'}
      flex="1"
      onClick={followStatus === 'Follow' ? handleUnfollowCallback : handleFollowCallback}>
      {followStatus}
    </Button>
  );
};
