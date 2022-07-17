import { Container } from "../../../components/Container";
import { Button } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/layout";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { useGetIntId } from "../../../utils/useGetIntId";
import { useRouter } from "next/router";

export const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [, updatePost] = useUpdatePostMutation();
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
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
      <Layout variant="small">
        <Box mt={8} mb={8}>
          <div>
            <Text fontSize="4xl">Create Post</Text>
          </div>
        </Box>
        <Formik
          initialValues={{ title: data.post.title, text: data.post.text }}
          onSubmit={async (values) => {
            await updatePost({ id: intId, ...values });
            router.back();
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="title" placeholder="Title" label="Title" />
              <Box mt={4}>
                <InputField
                  textarea
                  name="text"
                  placeholder="Text..."
                  label="Body"
                />
              </Box>

              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="cyan"
                color="white"
              >
                Update post
              </Button>
            </Form>
          )}
        </Formik>
      </Layout>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
