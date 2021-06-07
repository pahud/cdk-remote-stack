const { AwsCdkConstructLibrary, DependenciesUpgradeMechanism } = require('projen');

const AWS_CDK_LATEST_RELEASE = '1.77.0';
const PROJECT_NAME = 'cdk-remote-stack';
const PROJECT_DESCRIPTION = 'Get outputs from cross-regional AWS CDK stacks';
const AUTOMATION_TOKEN = 'AUTOMATION_GITHUB_TOKEN';

const project = new AwsCdkConstructLibrary({
  authorName: 'Pahud Hsieh',
  authorEmail: 'hunhsieh@amazon.com',
  name: PROJECT_NAME,
  description: PROJECT_DESCRIPTION,
  repository: 'https://github.com/pahud/cdk-remote-stack.git',
  antitamper: false,
  keywords: [
    'aws',
    'remote',
    'cross-region',
    'cross-stack',
    'cross-account',
  ],
  depsUpgrade: DependenciesUpgradeMechanism.githubWorkflow({
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: AUTOMATION_TOKEN,
    },
  }),
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['pahud'],
  },
  defaultReleaseBranch: 'master',
  catalog: {
    twitter: 'pahudnet',
    announce: false,
  },
  cdkVersion: AWS_CDK_LATEST_RELEASE,
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-logs',
    '@aws-cdk/custom-resources',
  ],

  python: {
    distName: 'cdk-remote-stack',
    module: 'cdk_remote_stack',
  },
});


const common_exclude = ['cdk.out', 'cdk.context.json', 'images', 'yarn-error.log'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
