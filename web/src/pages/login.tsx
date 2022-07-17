import { Container } from "../components/Container";
import React from "react";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Flex, Box, Text, Link } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../components/Layout";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Container height="100vh">
      <Layout>
        <Wrapper variant="small">
          <Box mt={8} mb={8}>
            <div>
              <Text fontSize="4xl">Login</Text>
            </div>
          </Box>
          <Formik
            initialValues={{ usernameOrEmail: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await login(values);
              if (response.data?.login.errors) {
                setErrors(toErrorMap(response.data.login.errors));
              } else if (response.data?.login.user) {
                if (typeof router.query.next === "string") {
                  router.push(router.query.next);
                } else {
                  // worked
                  router.push("/");
                }
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="usernameOrEmail"
                  placeholder="Username or Email"
                  label="Username or Email"
                />
                <Box mt={4}>
                  <InputField
                    name="password"
                    placeholder="Password"
                    label="Password"
                    type="password"
                  />
                </Box>

                <Flex mt={2}>
                  <NextLink href="/forgot-password">
                    <Link ml="auto">Forgot password?</Link>
                  </NextLink>
                </Flex>

                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="teal"
                  color="white"
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      </Layout>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
