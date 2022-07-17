import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Layout } from "../../components/Layout";
import { Box, Heading } from "@chakra-ui/layout";
import { Container } from "../../components/Container";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";

const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl();

  if (fetching) {
    return (
      <Container height="100vh">
        <Layout>
          <div>loading...</div>
        </Layout>
      </Container>
    );
  }

  if (error) {
    return (
      <Container height="100vh">
        <div>{error.message}</div>
      </Container>
    );
  }

  if (!data?.post) {
    return (
      <Container height="100vh">
        <Layout>
          <Box>Could not find post.</Box>
        </Layout>
      </Container>
    );
  }

  return (
    <Container height="100vh">
      <Layout>
        <Box mb={4}>
          <Heading mb={4}>{data.post.title}</Heading>
          {data.post.text}
        </Box>
        <EditDeletePostButtons
          id={data.post.id}
          creatorId={data.post.creator.id}
        />
      </Layout>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
