import { Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Container } from "../components/Container";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useForgotPasswordMutation } from "../generated/graphql";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, ForgotPassword] = useForgotPasswordMutation();
  return (
    <Container height="100vh">
      <DarkModeSwitch />
      <Wrapper variant="small">
        <Box mt={8} mb={8}>
          <div>
            <Text fontSize="4xl">Forgot Password</Text>
          </div>
        </Box>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            await ForgotPassword(values);
            setComplete(true);
          }}
        >
          {({ isSubmitting }) =>
            complete ? (
              <Box>
                If an account with that email exists, we sent you an email
              </Box>
            ) : (
              <Form>
                <InputField
                  name="email"
                  placeholder="Email"
                  label="Email"
                  type="email"
                />

                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="teal"
                  color="white"
                >
                  Forgot password
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
