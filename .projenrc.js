const { AwsCdkConstructLibrary, DependenciesUpgradeMechanism } = require('projen');

const AWS_CDK_LATEST_RELEASE = '1.77.0';
const PROJECT_NAME = 'cdk-remote-stack';
const PROJECT_DESCRIPTION = 'Get outputs and parameters from remote CDK stacks';
const AUTOMATION_TOKEN = 'AUTOMATION_GITHUB_TOKEN';

const project = new AwsCdkConstructLibrary({
  authorName: 'Pahud Hsieh',
  authorEmail: 'pahudnet@gmail.com',
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
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: AUTOMATION_TOKEN,
    },
  }),
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['pahud', 'cdk-automation'],
  },
  defaultReleaseBranch: 'main',
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
    '@aws-cdk/aws-ssm',
    '@aws-cdk/custom-resources',
  ],
  minNodeVersion: '12.20.0',
  python: {
    distName: 'cdk-remote-stack',
    module: 'cdk_remote_stack',
  },
});

const common_exclude = ['cdk.out', 'cdk.context.json', 'yarn-error.log'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
