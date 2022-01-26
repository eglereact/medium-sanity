import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { client, urlFor } from "../../sanity";
import { Post } from "../../taipings";

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  console.log(post);
  return (
    <main>
      <Header />
    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug{
            current
        }
    }`;

  const posts = await client.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
      title,
      slug,
      author -> {
      name,
      image
    },
    'comments': *[_type == "comment" && post._ref == ^._id && approved == true],
    description, 
    mainImage,
    body
    }`;

  const post = await client.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
