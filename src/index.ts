import * as cdk from '@aws-cdk/core';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as cr from '@aws-cdk/custom-resources';
import * as path from 'path';

/**
 * Properties of the StackOutputs
 */
export interface StackOutputsProps {
  /**
   * The remote CDK stack to get the outputs from.
   */
  readonly stack: cdk.Stack;

  /**
   * An optinal hash field to push stack changed by user
   */
  readonly hash?: string;
}

/**
 * Represents the StackOutputs of the remote CDK stack
 */
export class StackOutputs extends cdk.Construct {
  /**
   * The outputs from the remote stack.
   */
  readonly outputs: cdk.CustomResource;

  constructor(scope: cdk.Construct, id: string, props: StackOutputsProps) {
    super(scope, id)

    const onEvent = new lambda.Function(this, 'MyHandler', {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset(path.join(__dirname, '../custom-resource-handler')),
      handler: 'index.on_event',
    });

    const myProvider = new cr.Provider(this, 'MyProvider', {
      onEventHandler: onEvent,
      logRetention: logs.RetentionDays.ONE_DAY,
    });

    onEvent.addToRolePolicy(new PolicyStatement({
      actions: ['cloudformation:DescribeStacks'],
      resources: ['*'],
    }));

    this.outputs = new cdk.CustomResource(this, 'StackOutputs', {
      serviceToken: myProvider.serviceToken,
      properties: {
        stackName: props.stack.stackName,
        regionName: props.stack.region,
        hash: props.hash,
      },
    });
  }

  /**
   * Get the attribute value from the outputs.
   * @param key output key
   */
  public getAttString(key: string) {
    return this.outputs.getAttString(key)
  }

}
