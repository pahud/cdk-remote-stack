import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { RemoteOutputs, RemoteParameters } from '../src';

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


// create tests for `RemoteOutputs`
describe('RemoteOutputs', () => {
  test('RemoteOutputs creates the required resources', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'LocalStack');
    const remoteStack = new cdk.Stack(app, 'RemoteStack', {
      env: {
        region: 'us-east-1',
        account: '123456789012',
      },
    });

    // WHEN
    new RemoteOutputs(stack, 'RemoteOutputs', {
      stack: remoteStack,
    });

    // THEN
    const t = Template.fromStack(stack);
    // should have a lambda function
    t.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'remote-outputs.on_event',
      Runtime: 'python3.9',
    });

    // should have iam role with correct policies
    t.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            ],
          ],
        },
      ],
    });
  });
  test('RemoteOutputs with custom timeout', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'LocalStack');
    const remoteStack = new cdk.Stack(app, 'RemoteStack', {
      env: {
        region: 'us-east-1',
        account: '123456789012',
      },
    });

    // WHEN
    new RemoteOutputs(stack, 'RemoteOutputs', {
      stack: remoteStack,
      timeout: cdk.Duration.minutes(3),
    });

    // THEN
    const t = Template.fromStack(stack);
    // should have a lambda function with correct timeout
    t.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'remote-outputs.on_event',
      Runtime: 'python3.9',
      Timeout: 180,
    });
  });

});

describe('RemoteParameters', () => {
  test('creates the required resources', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'LocalStack');

    // WHEN
    new RemoteParameters(stack, 'RemoteParameters', {
      path: '/my/path',
      region: 'us-west-2',
    });

    // THEN
    const t = Template.fromStack(stack);

    // should have a lambda function
    t.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'remote-parameters.on_event',
      Runtime: 'python3.9',
    });

    // should have iam role with correct policies
    t.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            ],
          ],
        },
      ],
    });
  });
  test('RemoteParameters with custom timeout', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'LocalStack');

    // WHEN
    new RemoteParameters(stack, 'RemoteParameters', {
      path: '/my/path',
      region: 'us-west-2',
      timeout: cdk.Duration.minutes(3),
    });

    // THEN
    const t = Template.fromStack(stack);
    // should have a lambda function with correct timeout
    t.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'remote-parameters.on_event',
      Runtime: 'python3.9',
      Timeout: 180,
    });
  });
});
