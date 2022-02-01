import YAML from 'yaml';
import fs from 'fs';
import path from 'path';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log(`Starting tests...`);
  const config = YAML.parse(fs.readFileSync(path.resolve('config.yml'), { encoding: 'utf-8' }));
  const durationMs = config.duration_s * 1000;
  console.log(`Sleeping for ${durationMs} milliseconds`);
  await sleep(durationMs);

  let shouldFail = false;
  if (config.fail_if) {
    if (fs.existsSync(path.resolve(`flags/${config.fail_if}`))) {
      console.log(`Failing due to presence of ${config.fail_if} flag`);
      shouldFail = true;
    }
  }
  if (config.fail) {
    console.log(`Failing due to fail: true`);
    shouldFail = true;
  }

  if (shouldFail) {
    throw new Error(`A test failure was induced!`);
  }

  console.log(`Success.`);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
