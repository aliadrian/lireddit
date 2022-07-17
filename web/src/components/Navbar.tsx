import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { useRouter } from "next/router";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body = null;
  // data is loading
  if (fetching) {
    //user is not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex alignItems="center">
        <Button
          ml="auto"
          colorScheme="cyan"
          color="white"
          lineHeight={0}
          mx={6}
        >
          <NextLink href="/create-post">
            <Link style={{ textDecoration: "none" }}>Create post</Link>
          </NextLink>
        </Button>

        <Box color="white">{data.me.username}</Box>
        <Box>
          <Button
            onClick={async () => {
              await logout();
              router.reload();
            }}
            isLoading={logoutFetching}
            variant="link"
            fontWeight="400"
            ml={4}
            color="white"
          >
            Logout
          </Button>
        </Box>
      </Flex>
    );
  }

  // const x = 1050;
  // const y = -25;

  // const styles = {
  //   transform: `translate(${x}px, ${y}px)`,
  // };

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="teal" w="100%" p={4}>
      <Flex flex={1} align="center" maxW={800} mx="auto">
        <NextLink href="/">
          <Link>
            <Heading color="white">LiReddit</Heading>
          </Link>
        </NextLink>

        <Box ml="auto">
          {body}
          <DarkModeSwitch />
        </Box>
      </Flex>
    </Flex>
  );
};
