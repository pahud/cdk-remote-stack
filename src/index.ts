import * as path from 'path';
import {
  Stack, CustomResource, Duration,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_logs as logs,
  custom_resources as cr,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

/**
 * Properties of the RemoteOutputs
 */
export interface RemoteOutputsProps {
  /**
   * The remote CDK stack to get the outputs from.
   */
  readonly stack: Stack;
  /**
   * Indicate whether always update the custom resource to get the new stack output
   * @default true
   */
  readonly alwaysUpdate?: boolean;
  /**
   * timeout for custom resource handler
   * @default - no timeout specified.
   */
  readonly timeout?: Duration;
}

/**
 * Represents the RemoteOutputs of the remote CDK stack
 */
export class RemoteOutputs extends Construct {
  /**
   * The outputs from the remote stack.
   */
  readonly outputs: CustomResource;

  constructor(scope: Construct, id: string, props: RemoteOutputsProps) {
    super(scope, id);

    const onEvent = new lambda.Function(this, 'MyHandler', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset(path.join(__dirname, '../custom-resource-handler')),
      handler: 'remote-outputs.on_event',
      timeout: props.timeout,
    });

    const myProvider = new cr.Provider(this, 'MyProvider', {
      onEventHandler: onEvent,
      logRetention: logs.RetentionDays.ONE_DAY,
    });

    onEvent.addToRolePolicy(new iam.PolicyStatement({
      actions: ['cloudformation:DescribeStacks'],
      resources: ['*'],
    }));

    this.outputs = new CustomResource(this, 'RemoteOutputs', {
      serviceToken: myProvider.serviceToken,
      properties: {
        stackName: props.stack.stackName,
        regionName: Stack.of(props.stack).region,
        randomString: props.alwaysUpdate == false ? undefined : randomString(),
      },
    });
  }

  /**
   * Get the attribute value from the outputs.
   * @param key output key
   */
  public get(key: string) {
    return this.outputs.getAttString(key);
  }

}

/**
 * Properties of the RemoteParameters
 */
export interface RemoteParametersProps {
  // /**
  //  * The remote CDK stack to get the parameters from.
  //  */
  // readonly stack: cdk.Stack;
  /**
   * The region code of the remote stack.
   */
  readonly region: string;
  /**
   * The assumed role used to get remote parameters.
   */
  readonly role?: iam.IRole;
  /**
   * The parameter path.
   */
  readonly path: string;
  /**
   * Indicate whether always update the custom resource to get the new stack output
   * @default true
   */
  readonly alwaysUpdate?: boolean;
  /**
   * timeout for custom resource handler
   * @default - no timeout specified.
   */
  readonly timeout?: Duration;
}

/**
 * Represents the RemoteParameters of the remote CDK stack
 */
export class RemoteParameters extends Construct {
  /**
   * The parameters in the SSM parameter store for the remote stack.
   */
  readonly parameters: CustomResource;

  constructor(scope: Construct, id: string, props: RemoteParametersProps) {
    super(scope, id);

    const onEvent = new lambda.Function(this, 'MyHandler', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset(path.join(__dirname, '../custom-resource-handler')),
      handler: 'remote-parameters.on_event',
      timeout: props.timeout,
    });

    const myProvider = new cr.Provider(this, 'MyProvider', {
      onEventHandler: onEvent,
      logRetention: logs.RetentionDays.ONE_DAY,
    });

    onEvent.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'ssm:GetParameter',
        'ssm:GetParametersByPath',
      ],
      resources: ['*'],
    }));

    this.parameters = new CustomResource(this, 'SsmParameters', {
      serviceToken: myProvider.serviceToken,
      properties: {
        stackName: Stack.of(this).stackName,
        regionName: props.region,
        parameterPath: props.path,
        randomString: props.alwaysUpdate == false ? undefined : randomString(),
        role: props.role?.roleArn,
      },
    });

    if (props.role) {
      myProvider.onEventHandler.addToRolePolicy(new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
        resources: [props.role.roleArn],
      }));
    }
  }

  /**
   * Get the parameter.
   * @param key output key
   */
  public get(key: string) {
    return this.parameters.getAttString(key);
  }

}


function randomString() {
  // Crazy
  return Math.random().toString(36).replace(/[^a-z0-9]+/g, '');
}
