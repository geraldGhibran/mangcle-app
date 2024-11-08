import {
    Badge,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Progress,
    Stack,
    Text,
    useColorModeValue,
    useToast
} from '@chakra-ui/react';
import { Session, User } from '@supabase/supabase-js';
import { AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
    createPicture,
    createProfile,
    getFollowingCount,
    getPictureByProfileId,
    getProfileByAuthorEmail,
    publishProfile,
    saveProfile,
    updatePicture
} from '../api';
import { supabaseClient } from '../config/supabase-client';
import eventBus from '../eventBus';
import { useAuthStore } from '../store/auth';
import PersonalAvatar from './PersonalAvatar';

const EditProfile = () => {
  const {
    setProfileIdGlobal,
    setProfileGlobal,
    setProfileFollowing,
    profileId: profileIdFollow,
    profile: profileBgPicture
  } = useAuthStore();
  const [session, setSession] = useState<Session | null>();
  const [profile, setProfile] = useState<IProfile>();
  const [picture, setPicture] = useState<IPicture>();
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [name, setName] = useState<string>();
  const [website, setWebsite] = useState<string>();
  const [bio, setBio] = useState<string>();
  const [profileId, setProfileId] = useState<number>();
  const [authorEmail, setAuthorEmail] = useState<string>();
  const [user, setUser] = useState<User>();
  const [isEditingLanguage, setIsEditingLanguage] = useState<boolean>();
  const [isUrlUploaded, setIsUrlUploaded] = useState<boolean>();
  const [isPublic, setIsPublic] = useState<boolean>();
  const toast = useToast();
  const [backgroundgUrl, setBgUrl] = useState<any>(null);

  const cancelRef = useRef<HTMLButtonElement>(null);

  const color3 = useColorModeValue('gray.50', 'gray.800');
  const color4 = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error
      } = await supabaseClient.auth.getSession();
      if (error) throw error;
      setSession(session);
      if (session) {
        setUser(session.user);
      }
    };

    setData();
  }, []);

  const queryClient = useQueryClient();

  const fetchProfileFollowing = async () => {
    const res: AxiosResponse<ApiDataType> = await getFollowingCount(profileIdFollow);
    return res.data;
  };

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

  async function downloadImageBg(path: any) {
    try {
      const { data, error }: any = await supabaseClient.storage.from('images').download(path);
      if (error) {
        throw error;
      }
      const bgUrl: any = URL.createObjectURL(data);
      setBgUrl(bgUrl);
    } catch (error: any) {
      console.log('Error downloading image: ', error.message);
    }
  }

  const fetchProfilePicture = async () => {
    const res: AxiosResponse<ApiDataType> = await getPictureByProfileId(profile?.id!);
    return res.data;
  };

  const {
    data: pictureData,
    isLoading,
    isError,
    refetch: refetchPicture
  } = useQuery(['profilePicture'], fetchProfilePicture, {
    enabled: false,
    retry: 2,
    cacheTime: 0,
    onSuccess(res: IPicture) {
      queryClient.invalidateQueries(['profilePicture']);
      queryClient.invalidateQueries(['profileFollowing']);

      setPicture(res);
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

      setProfile(res);
      if (res != null) {
        setProfileGlobal(res);
        setUsername(res.username);
        setWebsite(res.website);
        setBio(res.bio);
        setName(res.name);
        setProfileId(res.id);
        setProfileIdGlobal(res.id);
        setIsPublic(res.isPublic);
        setAuthorEmail(res.authorEmail);
        setIsEditingLanguage(false);
      } else {
        setIsEditingLanguage(true);
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

  const postCreateProfile = async (): Promise<AxiosResponse> => {
    const profile: Omit<IProfile, 'id'> = {
      website: website!,
      username: username!,
      bio: bio!,
      name: name!,
      authorEmail: user?.email!
    };
    return await createProfile(profile);
  };

  const { isLoading: isCreatingProfile, mutate: postProfile } = useMutation(postCreateProfile, {
    onSuccess(res) {
      toast({
        title: 'Profile created.',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      refetchProfile();
    }
  });

  const postUpdateProfile = async (): Promise<AxiosResponse> => {
    const profile: IProfile = {
      website: website!,
      username: username!,
      bio: bio!,
      name: name!,
      authorEmail: user?.email!,
      id: profileId!
    };
    return await saveProfile(profile);
  };

  const { isLoading: isUpdatingProfile, mutate: updateProfile } = useMutation(postUpdateProfile, {
    onSuccess: res => {
      toast({
        title: 'Profile updated.',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      refetchProfile();
    },
    onError: err => {
      console.log(err);
    }
    //onMutate: () => console.log('mutating')
  });

  const postPublishProfile = async (): Promise<AxiosResponse> => {
    return await publishProfile(profileId!);
  };

  const { isLoading: isPublishingProfile, mutate: publish } = useMutation(postPublishProfile, {
    onSuccess: res => {
      toast({
        title: 'Profile published.',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      refetchProfile();
    },
    onError: err => {
      console.log(err);
    }
    //onMutate: () => console.log('mutating')
  });

  const postCreateProfilePicture = async (): Promise<AxiosResponse> => {
    const picture: Omit<IPicture, 'id'> = {
      profileId: profileId!,
      avatarUrl: avatarUrl!
    };
    return await createPicture(picture, session?.access_token!);
  };

  const { isLoading: isCreatingProfileUrl, mutate: createProfilePicture } = useMutation(postCreateProfilePicture, {
    onSuccess: res => {
      toast({
        title: 'Picture created.',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      eventBus.dispatch('profileUpdated', true);
    },
    onError: (err: any) => {
      toast({
        title: 'Error uploading picture',
        position: 'top',
        variant: 'subtle',
        description: err.response.data.error,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const postUpdateProfilePicture = async (): Promise<AxiosResponse> => {
    const picture: Omit<IPicture, 'id'> = {
      profileId: profileId!,
      avatarUrl: avatarUrl!
    };
    return await updatePicture(picture, session?.access_token!);
  };

  const { isLoading: isUpdatingProfileUrl, mutate: updateProfilePicture } = useMutation(postUpdateProfilePicture, {
    onSuccess: res => {
      toast({
        title: 'Picture updated.',
        position: 'top',
        variant: 'subtle',
        description: '',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      eventBus.dispatch('profileUpdated', true);
    },
    onError: err => {
      console.log(err);
    }
  });

  useEffect(() => {
    console.log('ini dari Profile.tsx line 345', profileId);

    if (user) {
      //console.log('user->', user)
      refetchProfile();
    }
    if (profile) {
      //console.log('prof', profile)
      refetchPicture();
      refetchProfileFollowing();
    }
    if (picture) {
      //console.log('pic pic', picture)
    }
    if (profileBgPicture?.backgroundPicture?.url) downloadImageBg(profileBgPicture?.backgroundPicture?.url);
  }, [user, refetchProfile, profile, refetchPicture, refetchProfileFollowing]);

  useEffect(() => {
    if (isUrlUploaded) {
      handleProfilePicture();
    }
  }, [isUrlUploaded]);

  async function handleProfilePicture() {
    try {
      picture?.id ? updateProfilePicture() : createProfilePicture();
    } catch (error: any) {
      alert(error.message);
    }
  }

  function postData() {
    try {
      if (profileId) {
        updateProfile();
      } else {
        postProfile();
      }
    } catch (err) {
      //setPostResult(fortmatResponse(err));
    }
  }
  if (isFetchingProfile) return <Progress size={'xs'} isIndeterminate />;

  return (
    <div>
      <Flex justify={'center'} w={'full'} bg={color3}>
        <Stack spacing={4} w={'full'} maxW="xl" bg={color4} rounded={'xl'} boxShadow={'lg'} p={6} my={12}>
          <Heading lineHeight={1.1} fontSize="2xl" alignSelf="center">
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Box backgroundImage={backgroundgUrl} w={'100%'} height="75px" position={'relative'}>
              <PersonalAvatar
                url={picture?.avatarUrl}
                disabled={!profileId}
                onUpload={(url: any) => {
                  setAvatarUrl(url);
                  setIsUrlUploaded(true);
                }}
              />
            </Box>
            <Box textAlign={'center'}>
              <Text fontSize={'sm'} fontWeight={500} color={'gray.500'} mb={4}>
                {session?.user.email}
              </Text>
              <Badge ml="1" colorScheme={isPublic ? `green` : `gray`}>
                {isPublic ? `Public` : `Private`}
              </Badge>
            </Box>
          </FormControl>
          <FormControl id="userName">
            <FormLabel>username</FormLabel>
            <Input
              placeholder={username || 'username'}
              type="text"
              value={username || ''}
              onChange={(e: any) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl id="name">
            <FormLabel>Fullname</FormLabel>
            <Input
              placeholder={name || 'name'}
              type="text"
              value={name || ''}
              onChange={(e: any) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl id="website">
            <FormLabel>website</FormLabel>
            <Input
              placeholder={website || 'website'}
              type="text"
              value={website || ''}
              onChange={(e: any) => setWebsite(e.target.value)}
            />
          </FormControl>
          <FormControl id="bio">
            <FormLabel>bio</FormLabel>
            <Input
              placeholder={bio || 'bio'}
              type="text"
              value={bio || ''}
              onChange={(e: any) => setBio(e.target.value)}
            />
          </FormControl>
          <Stack spacing={8} mx={'auto'} maxW={'xl'} py={12} px={6} direction={['column', 'row']}>
            <Button
              leftIcon={<FaCheck />}
              isLoading={isCreatingProfile || isUpdatingProfile}
              loadingText={profileId ? `Updating` : `Creating`}
              onClick={postData}
              disabled={!username || !website || !bio}
              bg={'blue.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'blue.500'
              }}>
              {profileId ? `Update` : `Save`}
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </div>
  );
};

export default EditProfile;
