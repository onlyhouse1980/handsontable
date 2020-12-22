const {
  displayErrorMessage,
  spawnProcess,
} = require('./common');

const [/* node bin */, /* path to this script */, version, releaseDate] = process.argv;

// Check if we're using the minimum required npm version.
spawnProcess('npm --version', true, (childProcess) => {
  const npmVersion = childProcess.stdout.toString().replace('\n', '').split('.');

  if (
    (npmVersion[0] < 7) ||
    (npmVersion[0] >= 7 && npmVersion[1] < 2)
  ) {
    displayErrorMessage('The minimum required npm version is 7.2.0');
    process.exit(1);
  }
});

// Check if all the files are committed.
spawnProcess('git status -s', true, (output) => {
  // If there are any uncommitted changes, kill the script.
  if (output.stdout.length > 0) {
    // TODO: temporarily commented
    // displayErrorMessage('There are uncommitted changes present. Exiting.');
    //
    // process.exitCode = 1;
  }
});

// Bump the version in all packages.
if (version && releaseDate) {
  spawnProcess(`node ./scripts/setVersion.js ${version} ${releaseDate}`);

} else {
  spawnProcess('node ./scripts/scheduleRelease.js');
}

// Clear the projects' node_modules nad lock files.
spawnProcess('node ./scripts/clean.js');

// Install fresh dependencies
spawnProcess('npm i');

// Build all packages.
spawnProcess('npm run all build');

// Test all packages.
spawnProcess('npm run all test');

// Verify if the bundles have the same (and correct) version.
spawnProcess('node ./scripts/verifyBundles.js');

// Check if we're on a release branch.
spawnProcess('git rev-parse --abbrev-ref HEAD', true, (childProcess) => {
  if (childProcess.stdout.toString().indexOf('release/') === -1) {
    displayErrorMessage('You are not on a release branch.');
    process.exit(1);
  }
});

// Commit the changes to the release branch.
// spawnProcess('');
