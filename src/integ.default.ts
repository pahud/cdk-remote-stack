import { App, aws_iam, aws_ssm, CfnOutput, PhysicalName, Stack } from 'aws-cdk-lib';

import { RemoteParameters, RemoteOutputs } from './';

export class IntegTesting {
  readonly stack: Stack[];

  constructor() {

    const app = new App();

    const envJP = {
      region: 'ap-northeast-1',
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const envUS = {
      region: 'us-west-2',
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    // first stack in JP
    const stackJP = new Stack(app, 'demo-stack-jp', { env: envJP });

    new CfnOutput(stackJP, 'TopicName', { value: 'foo' });

    // second stack in US
    const stackUS = new Stack(app, 'demo-stack-us', { env: envUS });

    // ensure the dependency
    stackUS.addDependency(stackJP);

    // get the stackJP stack outputs from stackUS
    const outputs = new RemoteOutputs(stackUS, 'Outputs', {
      stack: stackJP,
      alwaysUpdate: false,
    });

    const remoteOutputValue = outputs.get('TopicName');

    // the value should be exactly the same with the output value of `TopicName`
    new CfnOutput(stackUS, 'RemoteTopicName', { value: remoteOutputValue });

    this.stack = [stackJP, stackUS];
  }
}

export class IntegSsmParameters {
  readonly stack: Stack[];

  constructor() {

    const app = new App();

    const envJP = {
      region: 'ap-northeast-1',
      account: '111111111111',
    };

    const envUS = {
      region: 'us-west-2',
      account: '222222222222',
    };

    // first stack in JP
    const producerStackName = 'demo-stack-jp';
    const stackJP = new Stack(app, producerStackName, { env: envJP });
    const parameterPath = `/${envJP.account}/${envJP.region}/${producerStackName}`;

    new aws_ssm.StringParameter(stackJP, 'foo1', {

      parameterName: `${parameterPath}/foo1`,
      stringValue: 'bar1',
    });
    new aws_ssm.StringParameter(stackJP, 'foo2', {
      parameterName: `${parameterPath}/foo2`,
      stringValue: 'bar2',
    });
    new aws_ssm.StringParameter(stackJP, 'foo3', {
      parameterName: `${parameterPath}/foo3`,
      stringValue: 'bar3',
    });

    // allow US account to assume this readonly role to get parameters
    const cdkReadOnlyRole = new aws_iam.Role(stackJP, 'readOnlyRole', {
      assumedBy: new aws_iam.AccountPrincipal(envUS.account),
      roleName: PhysicalName.GENERATE_IF_NEEDED,
      managedPolicies: [aws_iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMReadOnlyAccess')],
    });

    // second stack in US
    const stackUS = new Stack(app, 'demo-stack-us', { env: envUS });

    // ensure the dependency
    stackUS.addDependency(stackJP);

    // get remote parameters by path from SSM parameter store
    const parameters = new RemoteParameters(stackUS, 'Parameters', {
      path: parameterPath,
      region: stackJP.region,
      // assume this role for cross-account parameters
      role: aws_iam.Role.fromRoleArn(stackUS, 'readOnlyRole', cdkReadOnlyRole.roleArn),
    });

    const foo1 = parameters.get(`${parameterPath}/foo1`);
    const foo2 = parameters.get(`${parameterPath}/foo2`);
    const foo3 = parameters.get(`${parameterPath}/foo3`);

    new CfnOutput(stackUS, 'foo1Output', { value: foo1 });
    new CfnOutput(stackUS, 'foo2Output', { value: foo2 });
    new CfnOutput(stackUS, 'foo3Output', { value: foo3 });

    this.stack = [stackJP, stackUS];
  }
}

new IntegTesting();
new IntegSsmParameters();
