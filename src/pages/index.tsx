import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type FetchImageParams = {
  after?: {
    id: string;
  };
  data: {
    title: string;
    description: string;
    url: string;
    ts: number;
    id: string;
  }[];
};

export default function Home(): JSX.Element {

  const fetchImages = async ({
    pageParam = 0,
  }): Promise<FetchImageParams> => {
    const response = await api.get('api/images', {
      params: {
        after: pageParam,
      },
    });
    return response.data;
  };

  // Infinite Queries
  // https://react-query.tanstack.com/guides/infinite-queries
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastRequest => {
      if (lastRequest.after) {
        return lastRequest.after;
      }
      return null;
    },
  });

  // ------------------------------
  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    if (data) {
      return data.pages.map(page => page.data).flat();
    }
    return null;
  }, [data]);


  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />      
      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {
          /* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */
          hasNextPage && (
            <Button
              isLoading={isFetchingNextPage}
              loadingText="Carregando..."
              spinnerPlacement="start"
              onClick={() => fetchNextPage()}
              marginTop='40px'
            >
              Carregar mais
            </Button>
          )
        }
      </Box>
    </>
  );
}
