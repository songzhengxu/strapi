import { createCommand } from 'commander';
import type { StrapiCommand } from '../types';

import { build as nodeBuild, BuildOptions } from '../../node/build';
import { handleUnexpectedError } from '../../node/core/errors';

interface BuildCLIOptions extends BuildOptions {}

const action = async (options: BuildCLIOptions) => {
  try {
    if (options.bundler === 'webpack') {
      options.logger.warn(
        '[@strapi/strapi]: Using webpack as a bundler is deprecated. You should migrate to vite.'
      );
    }

    /**
     * ENFORCE NODE_ENV to production when building
     */
    process.env.NODE_ENV = process.env.NODE_ENV ?? 'production';

    if (process.env.NODE_ENV !== 'production') {
      options.logger.warn(
        '[@strapi/strapi]: The NODE_ENV is not set to production. This may result in unexpected behavior.'
      );
    }

    await nodeBuild(options);
  } catch (err) {
    handleUnexpectedError(err);
  }
};

/**
 * `$ strapi build`
 */
const command: StrapiCommand = ({ ctx }) => {
  return createCommand('build')
    .option('--bundler [bundler]', 'Bundler to use (webpack or vite)', 'vite')
    .option('-d, --debug', 'Enable debugging mode with verbose logs', false)
    .option('--minify', 'Minify the output', true)
    .option('--silent', "Don't log anything", false)
    .option('--sourcemap', 'Produce sourcemaps', false)
    .option('--stats', 'Print build statistics to the console', false)
    .description('Build the strapi admin app')
    .action(async (options: BuildCLIOptions) => {
      return action({ ...options, ...ctx });
    });
};

export { command };