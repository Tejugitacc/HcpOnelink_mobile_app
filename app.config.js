import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      WEB_API_KEY: process.env.WEB_API_KEY,
    }
  };
};
