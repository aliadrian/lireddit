import { Container } from "../components/Container";
import { Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  return (
    <Container height="100vh">
      <Layout variant="small">
        <Box mt={8} mb={8}>
          <div>
            <Text fontSize="4xl">Create Post</Text>
          </div>
        </Box>
        <Formik
          initialValues={{ title: "", text: "" }}
          onSubmit={async (values) => {
            const { error } = await createPost({ input: values });
            if (!error) {
              router.push("/");
            }
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
                Create post
              </Button>
            </Form>
          )}
        </Formik>
      </Layout>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
