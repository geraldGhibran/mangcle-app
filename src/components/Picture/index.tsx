import { Avatar, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../../config/supabase-client';
import { BGProfileCover } from '../../assets';

type PictureProps = {
  url?: string;
  bgUrl?: string;
  isBg?: boolean;
};

const Picture = ({ url, isBg, bgUrl }: PictureProps) => {
  const [avatarUrl, setAvatarUrl] = useState<any>(null);
  const [backgroundgUrl, setBgUrl] = useState<any>(null);

  useEffect(() => {
    if (url) downloadImage(url);
    if (bgUrl) downloadImageBg(bgUrl);
  }, [url, bgUrl]);

  async function downloadImage(path: any) {
    try {
      const { data, error }: any = await supabaseClient.storage.from('images').download(path);
      if (error) {
        throw error;
      }
      const url: any = URL.createObjectURL(data);
      setAvatarUrl(url);
      setAvatarUrl(url);
    } catch (error: any) {
      console.log('Error downloading image: ', error.message);
    }
  }

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

  return (
    <>
      {isBg ? (
        <Box backgroundImage={backgroundgUrl === null ? BGProfileCover : backgroundgUrl} w={'100%'} height="75px" position={'relative'}>
          <Avatar
            src={avatarUrl}
            w={'100px'}
            h={'100px'}
            bottom={'-10'}
            left={'3'}
            position={'absolute'}
            border={'1px solid black'}
          />
        </Box>
      ) : (
        <Avatar src={avatarUrl} />
      )}
    </>
  );
};

export default Picture;
