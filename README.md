[![awscdk-jsii-template](https://img.shields.io/badge/built%20with-awscdk--jsii--template-blue)](https://github.com/pahud/awscdk-jsii-template)
[![NPM version](https://badge.fury.io/js/cdk-remote-stack.svg)](https://badge.fury.io/js/cdk-remote-stack)
[![PyPI version](https://badge.fury.io/py/cdk-remote-stack.svg)](https://badge.fury.io/py/cdk-remote-stack)
![Release](https://github.com/pahud/cdk-remote-stack/workflows/Release/badge.svg)

# cdk-remote-stack
Get outputs from cross-regional AWS CDK stacks

# Why

AWS CDK cross-regional cross-stack reference is not easy with the native AWS CDK construct library.

`cdk-remote-stack` aims to simplify the cross-regional cross-stack reference to help you easily build cross-regional multi-stack AWS CDK apps.


# Sample

Let's say we have two cross-region CDK stacks in the same cdk app:

1. **stackJP** - cdk stack in `JP` to create a SNS topic
2. **stackUS** - cdk stack in `US` to get the Outputs from `stackJP` and print out the SNS `TopicName` from `stackJP` Outputs.


```ts
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
```
