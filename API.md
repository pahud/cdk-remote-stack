# API Reference

**Classes**

Name|Description
----|-----------
[RemoteOutputs](#cdk-remote-stack-remoteoutputs)|Represents the RemoteOutputs of the remote CDK stack.
[RemoteParameters](#cdk-remote-stack-remoteparameters)|Represents the RemoteParameters of the remote CDK stack.


**Structs**

Name|Description
----|-----------
[RemoteOutputsProps](#cdk-remote-stack-remoteoutputsprops)|Properties of the RemoteOutputs.
[RemoteParametersProps](#cdk-remote-stack-remoteparametersprops)|Properties of the RemoteParameters.



## class RemoteOutputs  <a id="cdk-remote-stack-remoteoutputs"></a>

Represents the RemoteOutputs of the remote CDK stack.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new RemoteOutputs(scope: Construct, id: string, props: RemoteOutputsProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[RemoteOutputsProps](#cdk-remote-stack-remoteoutputsprops)</code>)  *No description*
  * **stack** (<code>[Stack](#aws-cdk-core-stack)</code>)  The remote CDK stack to get the outputs from. 
  * **alwaysUpdate** (<code>boolean</code>)  Indicate whether always update the custom resource to get the new stack output. __*Default*__: true



### Properties


Name | Type | Description 
-----|------|-------------
**outputs** | <code>[CustomResource](#aws-cdk-core-customresource)</code> | The outputs from the remote stack.

### Methods


#### get(key) <a id="cdk-remote-stack-remoteoutputs-get"></a>

Get the attribute value from the outputs.

```ts
get(key: string): string
```

* **key** (<code>string</code>)  output key.

__Returns__:
* <code>string</code>



## class RemoteParameters  <a id="cdk-remote-stack-remoteparameters"></a>

Represents the RemoteParameters of the remote CDK stack.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new RemoteParameters(scope: Construct, id: string, props: RemoteParametersProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[RemoteParametersProps](#cdk-remote-stack-remoteparametersprops)</code>)  *No description*
  * **path** (<code>string</code>)  The parameter path. 
  * **region** (<code>string</code>)  The region code of the remote stack. 
  * **alwaysUpdate** (<code>boolean</code>)  Indicate whether always update the custom resource to get the new stack output. __*Default*__: true
  * **role** (<code>[IRole](#aws-cdk-aws-iam-irole)</code>)  The assumed role used to get remote parameters. __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**parameters** | <code>[CustomResource](#aws-cdk-core-customresource)</code> | The parameters in the SSM parameter store for the remote stack.

### Methods


#### get(key) <a id="cdk-remote-stack-remoteparameters-get"></a>

Get the parameter.

```ts
get(key: string): string
```

* **key** (<code>string</code>)  output key.

__Returns__:
* <code>string</code>



## struct RemoteOutputsProps  <a id="cdk-remote-stack-remoteoutputsprops"></a>


Properties of the RemoteOutputs.



Name | Type | Description 
-----|------|-------------
**stack** | <code>[Stack](#aws-cdk-core-stack)</code> | The remote CDK stack to get the outputs from.
**alwaysUpdate**? | <code>boolean</code> | Indicate whether always update the custom resource to get the new stack output.<br/>__*Default*__: true



## struct RemoteParametersProps  <a id="cdk-remote-stack-remoteparametersprops"></a>


Properties of the RemoteParameters.



Name | Type | Description 
-----|------|-------------
**path** | <code>string</code> | The parameter path.
**region** | <code>string</code> | The region code of the remote stack.
**alwaysUpdate**? | <code>boolean</code> | Indicate whether always update the custom resource to get the new stack output.<br/>__*Default*__: true
**role**? | <code>[IRole](#aws-cdk-aws-iam-irole)</code> | The assumed role used to get remote parameters.<br/>__*Optional*__



