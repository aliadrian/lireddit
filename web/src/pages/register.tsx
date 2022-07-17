import { Container } from "../components/Container";
import React from "react";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Container height="100vh">
      <Layout>
        <Wrapper variant="small">
          <Box mt={8} mb={8}>
            <div>
              <Text fontSize="4xl">Register</Text>
            </div>
          </Box>
          <Formik
            initialValues={{ email: "", username: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await register({ options: values });
              if (response.data?.register.errors) {
                setErrors(toErrorMap(response.data.register.errors));
              } else if (response.data?.register.user) {
                // worked
                router.push("/");
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="username"
                  placeholder="Username"
                  label="Username"
                />
                <Box mt={4}>
                  <InputField
                    name="email"
                    placeholder="Email"
                    label="Email"
                    type="email"
                  />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="password"
                    placeholder="Password"
                    label="Password"
                    type="password"
                  />
                </Box>
                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="teal"
                  color="white"
                >
                  Register
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      </Layout>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
