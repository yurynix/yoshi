declare module NodeJS {
  interface Global {
    yoshiPublishDir: string;
    teardown: () => void;
  }
}
