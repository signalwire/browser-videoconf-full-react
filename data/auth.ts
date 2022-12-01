if (process.env.PROJECT_ID === undefined || process.env.API_TOKEN === undefined)
  console.error(
    ".env doesn't seem to have been properly configured with SignalWire credentials"
  );
export const AUTH = {
  username: process.env.PROJECT_ID as string,
  password: process.env.API_TOKEN as string,
};
export const SPACE_NAME = process.env.SPACE_NAME as string;
