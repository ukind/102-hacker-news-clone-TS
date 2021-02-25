import React from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import ErrorComponent from 'next/error'


const fetchHandler = {
  fetch: async (url: string, headers: Headers): Promise<Response> =>
    import('isomorphic-fetch').then((find) => find.default(url, { headers })),
};

interface IStories {
  id: number;
  title: string;
}

const Index = ({ stories }: { stories: IStories[] }): JSX.Element => {

  if (stories.length === 0) {
    return <ErrorComponent statusCode={503} />;
  }

  return (
    <ul>
      {stories.map((story) => <li key={story.id}>{story.title}</li>)}
    </ul>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36',
  });

  let stories: IStories[]

  try {
    stories = await fetchHandler
      .fetch(`https://node-hnapi.herokuapp.com/news?page=1`, headers)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(JSON.stringify(response));
        }
        return response.json();
      })
      .then((data: IStories[]) => data);
  } catch (err) {
    stories = [];
  }

  return {
    props: {
      stories,
    },
  };
};

export default React.memo(Index);
