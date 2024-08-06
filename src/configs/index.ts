import './theme/index.css';

import { env } from './env';
import rpc from './rpc.config';

const configs = {
  rpc: rpc[env],
};

export default configs;
