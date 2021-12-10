import * as cdk from 'aws-cdk-lib';
import { RemoteOutputs } from '../src';

test('create the ServerlessAPI', () => {
  const app = new cdk.App();

  const envJP = {
    region: 'ap-northeast-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
  };

  const envUS = {
    region: 'us-west-2',
    account: process.env.CDK_DEFAULT_ACCOUNT,
  };

  // first stack in JP
  const stackJP = new cdk.Stack(app, 'demo-stack-jp', { env: envJP });

  new cdk.CfnOutput(stackJP, 'TopicName', { value: 'foo' });

  // second stack in US
  const stackUS = new cdk.Stack(app, 'demo-stack-us', { env: envUS });

  // get the stackJP stack outputs from stackUS
  const outputs = new RemoteOutputs(stackUS, 'Outputs', { stack: stackJP });

  const remoteOutputValue = outputs.get('TopicName');

  // the value should be exactly the same with the output value of `TopicName`
  new cdk.CfnOutput(stackUS, 'RemoteTopicName', { value: remoteOutputValue });

  const t = cdk.assertions.Template.fromStack(stackUS);
  t.hasResourceProperties('AWS::CloudFormation::CustomResource', {
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
