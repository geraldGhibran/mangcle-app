import { useDebounce } from '@uidotdev/usehooks';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { getProfileText } from '../api';
import { supabaseClient } from '../config/supabase-client';

export const useSearchUser = () => {
  async function downloadImage(path: any) {
    try {
      const { data, error }: any = await supabaseClient.storage.from('images').download(path);
      if (error) {
        throw error;
      }
      const url: any = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error: any) {
      console.log('Error downloading image: ', error.message);
    }
  }

  const { register, watch } = useForm({
    defaultValues: {
      search: ''
    }
  });

  const fetchProfileByText = async () => {
    const res: AxiosResponse<ApiDataType> = await getProfileText(watch('search'));
    return res.data;
  };

  const {
    data: profileData,
    error,
    isLoading: isFetchingProfile,
    refetch: refetchProfileByText
  } = useQuery('profile', fetchProfileByText, {
    retry: 0,
    enabled: false,
    onSuccess(res: IProfile[] | undefined) {
      setUsers(res);
    },

    onError: err => {
      console.log(err);
    }
  });

  const [users, setUsers] = useState<IProfile[] | undefined>();

  const [avatarUrl, setAvatarUrl] = useState<any>(null);
  const debouncedUsers = useDebounce(watch('search'), 1000);

  useEffect(() => {
    refetchProfileByText();
    downloadImage(avatarUrl);
    const filteredUser = users?.filter(user => user.username.includes(debouncedUsers));

    setUsers(filteredUser);
  }, [debouncedUsers, refetchProfileByText]);

  return {
    register,
    watch,
    users,
    avatarUrl,
    setAvatarUrl
  };
};
