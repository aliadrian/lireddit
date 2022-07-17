import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import cors from "cors";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import path from "path";
import { Updoot } from "./entities/Updoot";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";

// rerun
const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "lireddit2",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot],
  });
  await conn.runMigrations();

  // await Post.delete({});
  // await orm.em.nativeDelete(User, {});

  const app = express();

  const RedisStore = require("connect-redis")(session);
  const redis = new Redis();
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only woks in https
      },
      saveUninitialized: false,
      secret: "H4bNJWCVJo",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  // app.get("/", (_, res) => {
  //   res.send("Hello World!");
  // });
  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
  // const post = orm.em.create(Post, { title: "My third Post!" });
  // await orm.em.persistAndFlush(post);
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};

main().catch((err) => {
  console.log(err);
});
