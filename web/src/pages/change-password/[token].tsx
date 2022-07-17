import { Text } from "@chakra-ui/layout";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import { Box, Button, Link, Flex } from "@chakra-ui/react";
import NextLink from "next/link";
import { Container } from "../../components/Container";
import { DarkModeSwitch } from "../../components/DarkModeSwitch";

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Container height="100vh">
      <DarkModeSwitch />
      <Wrapper variant="small">
        <Box mt={8} mb={8}>
          <div>
            <Text fontSize="4xl">Change Password</Text>
          </div>
        </Box>
        <Formik
          initialValues={{ newPassword: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await changePassword({
              newPassword: values.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            });
            if (response.data?.changePassword.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors);
              if ("token" in errorMap) {
                setTokenError(errorMap.token);
              }
              setErrors(errorMap);
            } else if (response.data?.changePassword.user) {
              // worked
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="newPassword"
                placeholder="New password"
                label="New password"
                type="password"
              />

              {tokenError ? (
                <Flex mt={2}>
                  <Box mr={4} style={{ color: "red" }}>
                    {tokenError}
                  </Box>
                  <NextLink href="/forgot-password">
                    <Link>Click here to get a new password</Link>
                  </NextLink>
                </Flex>
              ) : null}

              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
                color="white"
              >
                Change password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
