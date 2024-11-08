import { Button, useToast } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addFollow, unFollow } from '../../api';
import { useAuthStore } from '../../store/auth';

export const FollowButton = ({ followingId, user }: any) => {
  const toast = useToast();

  const [followStatus, setFollowStatus] = useState('follow');

  const { user: session, profileId } = useAuthStore();

  console.log(followingId)

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
      queryClient.invalidateQueries(['profile']);
      queryClient.invalidateQueries(['profileFollowing']);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  });

  useEffect(() => {
    checkFollowStatus(user, profileId);
  }, []);

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
