import { StackOutputs } from './';
import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';


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
const stackJP = new cdk.Stack(app, 'demo-stack-jp', { env: envJP })

const topic = new sns.Topic(stackJP, 'Topic');

new cdk.CfnOutput(stackJP, 'TopicName', { value: topic.topicName })

// second stack in US
const stackUS = new cdk.Stack(app, 'demo-stack-us', { env: envUS })

// get the stackJP stack outputs from stackUS
const outputs = new StackOutputs(stackUS, 'Outputs', { stack: stackJP })

const remoteOutputValue = outputs.getAttString('TopicName')

// the value should be exactly the same with the output value of `TopicName`
new cdk.CfnOutput(stackUS, 'RemoteTopicName', { value: remoteOutputValue })
