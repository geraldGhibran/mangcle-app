import { useAuthStore } from '../../store/auth';
import { addFollow, getProfileText } from '../../api';
import { useDebounce } from '@uidotdev/usehooks';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { supabaseClient } from '../../config/supabase-client';
import { useToast } from '@chakra-ui/react';

export const useFollow = () => {
  const toast = useToast();

  const { user: session, profileId } = useAuthStore();
  const [followingId, setFollowingId] = useState(0);

  const createFollow = async (): Promise<AxiosResponse> => {
    const post: Omit<IFollow, 'id'> = {
      followerId: profileId!,
      followingId: followingId
    };
    return await addFollow(post, session?.access_token!);
  };

  console.log("dari follow hook", session?.access_token!)

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
    }
  });

  function handleFollowCallback(): void {
    postFollow();
  }

  return {
    handleFollowCallback,
    setFollowingId,
    postFollow
  };
};
