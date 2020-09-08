const {
  ConstructLibraryAws,
} = require('projen');

const AWS_CDK_LATEST_RELEASE = '1.62.0';
const PROJECT_NAME = 'cdk-remote-stack';
const PROJECT_DESCRIPTION = 'Get outputs from cross-regional AWS CDK stacks';

const project = new ConstructLibraryAws({
  authorName: "Pahud Hsieh",
  authorEmail: "hunhsieh@amazon.com",
  name: PROJECT_NAME,
  description: PROJECT_DESCRIPTION,
  repository: "https://github.com/pahud/cdk-remote-stack.git",
  keywords: [
    'aws',
    'remote',
    'cross-region',
    'cross-stack',
    'cross-account'
  ],

  catalog: {
    twitter: 'pahudnet',
    announce: false
  },

  // creates PRs for projen upgrades
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

  cdkVersion: AWS_CDK_LATEST_RELEASE,
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-logs',
    '@aws-cdk/aws-sns',
    '@aws-cdk/custom-resources',
  ],

  python: {
    distName: 'cdk-remote-stack',
    module: 'cdk_remote_stack'
  }
});

const common_exclude = ['cdk.out', 'cdk.context.json', 'images', 'yarn-error.log'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
