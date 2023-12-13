/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import fetchData from "./utils/fetchData";

const cap = 3000; // 3s wait max
const base = 5; // 5 retries
const random_between = (min: number, max: number) => Math.random() * (max - min) + min;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: base,
      retryDelay: attempt => random_between(0, Math.min(cap, base * 2 ** attempt)),
    },
  },
});

export default function Query() {
  const [postId, setPostId] = React.useState(-1);

  return (
    <QueryClientProvider client={queryClient}>
      <p>
        As you visit the posts below, you will notice them in a loading state
        the first time you load them. However, after you return to this list and
        click on any posts you have already visited again, you will see them
        load instantly and background refresh right before your eyes!{" "}
        <strong>
          (You may need to throttle your network speed to simulate longer
          loading sequences)
        </strong>
      </p>
      {postId > -1 ? (
        <Post postId={postId} setPostId={setPostId} />
      ) : (
        <Posts setPostId={setPostId} />
      )}
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

// function usePosts() {
//   return useQuery("posts", async () => {
//     const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
//         method: 'GET',
//         headers: { 'Accept': 'application/json' },
//     }
//     );
//     if (!res.ok || res.status >= 300 ) {
//       throw new Error('Service Error: ' + res.status)
//     }  
//     return res;
//   });
// }

function Posts({ setPostId }: { setPostId: (id: number)=>void }) {
  const queryClient = useQueryClient();
  const { data, error, isFetching, isError } = useQuery("posts", 
                          () => fetchData("https://jsonplaceholder.typicode.com/posts")
                        );
  // Any conversion needed, we'll do it here
  //
  // useEffect(() => {
  //   const mapped = !!data && isSuccess ? mapping(data) : null;
  //   console.log('get data', data)
  //   if (mapped) {
  //     setPokemon(one)
  //   }
  // }, [data, isSuccess])

  return (
    <div>
      <h1>Posts</h1>
      <div>
        {isFetching ? (
          "Loading..."
        ) : isError ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data.map((post) => (
                <p key={post.id}>
                  <a
                    onClick={() => setPostId(post.id)}
                    href="#"
                    style={
                      // We can access the query data here to show bold links for
                      // ones that are cached
                      queryClient.getQueryData(["post", post.id])
                        ? {
                            fontWeight: "bold",
                            color: "green",
                          }
                        : {}
                    }
                  >
                    {post.title}
                  </a>
                </p>
              ))}
            </div>
            <div>{isFetching ? "Background Updating..." : " "}</div>
          </>
        )}
      </div>
    </div>
  );
}

const getPostById = async (id: number) => {
  return await fetchData(`https://jsonplaceholder.typicode.com/posts/${id}`);
};

function usePost(postId: number) {
  return useQuery(["post", postId], () => getPostById(postId), {
    enabled: !!postId,
  });
}

function Post({ postId, setPostId }: { postId: number, setPostId: (id: number) => void }) {
  const { status, data, error, isFetching } = usePost(postId) as any;

  return (
    <div>
      <div>
        <a onClick={() => setPostId(-1)} href="#">
          Back
        </a>
      </div>
      {!postId || status === "loading" ? (
        "Loading..."
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <h1 style={{ textTransform: 'capitalize' }}>{data.title}</h1>
          <pre style={{ display: 'grid', border: '1px solid rgb(134, 165, 36,0.8)'}}>
            <p>{data.body}</p>
          </pre>
          <div>{isFetching ? "Updating..." : " "}</div>
        </>
      )}
    </div>
  );
}

