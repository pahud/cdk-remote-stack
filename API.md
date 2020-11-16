# API Reference

**Classes**

Name|Description
----|-----------
[StackOutputs](#cdk-remote-stack-stackoutputs)|Represents the StackOutputs of the remote CDK stack.


**Structs**

Name|Description
----|-----------
[StackOutputsProps](#cdk-remote-stack-stackoutputsprops)|Properties of the StackOutputs.



## class StackOutputs  <a id="cdk-remote-stack-stackoutputs"></a>

Represents the StackOutputs of the remote CDK stack.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new StackOutputs(scope: Construct, id: string, props: StackOutputsProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[StackOutputsProps](#cdk-remote-stack-stackoutputsprops)</code>)  *No description*
  * **stack** (<code>[Stack](#aws-cdk-core-stack)</code>)  The remote CDK stack to get the outputs from. 
  * **alwaysUpdate** (<code>boolean</code>)  Indicate whether always update the custom resource to get the new stack output. __*Default*__: true



### Properties


Name | Type | Description 
-----|------|-------------
**outputs** | <code>[CustomResource](#aws-cdk-core-customresource)</code> | The outputs from the remote stack.

### Methods


#### getAttString(key) <a id="cdk-remote-stack-stackoutputs-getattstring"></a>

Get the attribute value from the outputs.

```ts
getAttString(key: string): string
```

* **key** (<code>string</code>)  output key.

__Returns__:
* <code>string</code>



## struct StackOutputsProps  <a id="cdk-remote-stack-stackoutputsprops"></a>


Properties of the StackOutputs.



Name | Type | Description 
-----|------|-------------
**stack** | <code>[Stack](#aws-cdk-core-stack)</code> | The remote CDK stack to get the outputs from.
**alwaysUpdate**? | <code>boolean</code> | Indicate whether always update the custom resource to get the new stack output.<br/>__*Default*__: true



