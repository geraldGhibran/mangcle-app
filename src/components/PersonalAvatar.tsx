import { Avatar, Box, Button, Flex, keyframes, Tooltip } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../config/supabase-client';
import { UPLOAD_PICTURE_DISABLED_TEXT } from '../utils/constants';
import { useAuthStore } from '../store/auth';

const PersonalAvatar = ({ url, onUpload, disabled }: any) => {
  const [avatarUrl, setAvatarUrl] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const { setProfilePicture } = useAuthStore();
  const size = '96px';
  const color = 'teal';

  const pulseRing = keyframes`
	0% {
    transform: scale(0.33);
  }
  40%,
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
  `;

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: any) {
    try {
      const { data, error }: any = await supabaseClient.storage.from('images').download(path);
      if (error) {
        throw error;
      }
      const url: any = URL.createObjectURL(data);
      setAvatarUrl(url);
      setProfilePicture(url);
    } catch (error: any) {
      console.log('Error downloading image: ', error.message);
    }
  }

  async function uploadAvatar(event: any) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabaseClient.storage.from('images').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <Avatar src={avatarUrl} w={'100px'} h={'100px'} bottom={'-10'} left={'3'} position={'absolute'} size="full" />
      <Box textAlign={'center'} overflow="hidden">
        <Tooltip isDisabled={!disabled} placement="left" hasArrow label={UPLOAD_PICTURE_DISABLED_TEXT} bg={'green.600'}>
          <Button
            disabled={disabled}
            size="sm"
            flex={1}
            mb={4}
            bottom={'-10'}
            left={'6'}
            position={'absolute'}
            fontSize={'sm'}
            rounded={'full'}
            _focus={{
              bg: 'gray.200'
            }}>
            <label className="button primary block" htmlFor="single">
              {uploading ? 'Uploading ...' : 'Upload'}
            </label>
          </Button>
        </Tooltip>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
            cursor: 'pointer'
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading || disabled}
        />
      </Box>
    </>
  );
};

export default PersonalAvatar;
