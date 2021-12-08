import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { RemoteOutputs } from '../src';
import '@aws-cdk/assert/jest';

test('create the ServerlessAPI', () => {
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

  // get the stackJP stack outputs from stackUS
  const outputs = new RemoteOutputs(stackUS, 'Outputs', { stack: stackJP });

  const remoteOutputValue = outputs.get('TopicName');

  // the value should be exactly the same with the output value of `TopicName`
  new CfnOutput(stackUS, 'RemoteTopicName', { value: remoteOutputValue });

  expect(stackUS).toHaveResource('AWS::CloudFormation::CustomResource', {
    ServiceToken: {
      'Fn::GetAtt': [
        'OutputsMyProviderframeworkonEvent64931F85',
        'Arn',
      ],
    },
    stackName: 'demo-stack-jp',
    regionName: 'ap-northeast-1',
  });
});
