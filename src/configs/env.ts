/**
 * Environment
 */
const getEnv = () => {
  switch (process.env.REACT_APP_ENV) {
    case 'development':
      return 'development';
    case 'test':
      return 'test';
    case 'production':
      return 'production';
    default:
      return 'development';
  }
};
export type Env = 'development' | 'test' | 'production';
export const env: Env = getEnv();
