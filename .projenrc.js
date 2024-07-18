const { awscdk, DevEnvironmentDockerImage, Gitpod } = require('projen');

const PROJECT_NAME = 'cdk-remote-stack';
const PROJECT_DESCRIPTION = 'Get outputs and AWS SSM parameters from cross-region AWS CloudFormation stacks';
const AUTOMATION_TOKEN = 'AUTOMATION_GITHUB_TOKEN';

const project = new awscdk.AwsCdkConstructLibrary({
  authorName: 'Pahud Hsieh',
  authorEmail: 'pahudnet@gmail.com',
  name: PROJECT_NAME,
  description: PROJECT_DESCRIPTION,
  repository: 'https://github.com/pahud/cdk-remote-stack.git',
  authorUrl: 'https://twitter.com/pahudnet',
  keywords: [
    'aws',
    'remote',
    'cross-region',
    'cross-stack',
    'cross-account',
  ],
  /**
   * we default release the main branch(cdkv2) with major version 2.
   */
  majorVersion: 2,
  defaultReleaseBranch: 'main',
  /**
    * we also release the cdkv1 branch with major version 1.
    */
  // releaseBranches: {
  //   cdkv1: { npmDistTag: 'cdkv1', majorVersion: 1 },
  // },
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: AUTOMATION_TOKEN,
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['pahud', 'cdk-automation'],
  },
  defaultReleaseBranch: 'main',
  catalog: {
    twitter: 'pahudnet',
    announce: false,
  },
  cdkVersion: '2.85.0',
  python: {
    distName: 'cdk-remote-stack',
    module: 'cdk_remote_stack',
  },
});

const gitpodPrebuild = project.addTask('gitpod:prebuild', {
  description: 'Prebuild setup for Gitpod',
});
// install and compile only, do not test or package.
gitpodPrebuild.exec('yarn install --frozen-lockfile --check-files');
gitpodPrebuild.exec('npx projen compile');

let gitpod = new Gitpod(project, {
  dockerImage: DevEnvironmentDockerImage.fromImage('public.ecr.aws/pahudnet/gitpod-workspace:latest'),
  prebuilds: {
    addCheck: true,
    addBadge: true,
    addLabel: true,
    branches: true,
    pullRequests: true,
    pullRequestsFromForks: true,
  },
});

gitpod.addCustomTask({
  init: 'yarn gitpod:prebuild',
  // always upgrade after init
  command: 'npx projen upgrade',
});

gitpod.addVscodeExtensions(
  'dbaeumer.vscode-eslint',
  'ms-azuretools.vscode-docker',
  'AmazonWebServices.aws-toolkit-vscode',
);

const common_exclude = ['cdk.out', 'cdk.context.json', 'yarn-error.log'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
