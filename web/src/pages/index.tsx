import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { Container } from "../components/Container";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });

  // console.log(variables);

  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <div>
        <div>Posts could not load</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Container height="100%">
      <Layout>
        {/* <Flex align="center">
          <Heading>LiReddit</Heading>
          <Button
            ml="auto"
            my={4}
            colorScheme="teal"
            color="white"
            lineHeight={0}
          >
            <NextLink href="/create-post">
              <Link style={{ textDecoration: "none" }}>Create post</Link>
            </NextLink>
          </Button>
        </Flex> */}
        <br />
        {!data && fetching ? (
          <div>Loading...</div>
        ) : (
          <Stack spacing={8} mb={9}>
            {data!.posts.posts.map((p) =>
              !p ? null : (
                <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                  <UpdootSection post={p} />
                  <Box flex={1}>
                    <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                      <Link>
                        <Heading style={{ marginTop: "-2.5px" }} fontSize="xl">
                          {p.title}
                        </Heading>
                      </Link>
                    </NextLink>
                    <Text>Posted by {p.creator.username}</Text>
                    <Flex align="center">
                      <Text flex={1} mt={6}>
                        {p.textSnippet}
                      </Text>
                      <Box ml="auto">
                        <EditDeletePostButtons
                          id={p.id}
                          creatorId={p.creator.id}
                        />
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              )
            )}
          </Stack>
        )}
        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              isLoading={fetching}
              m="auto"
              my={8}
              colorScheme="teal"
              color="white"
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                });
              }}
            >
              Load more
            </Button>
          </Flex>
        ) : null}
      </Layout>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
