#!/usr/bin/env python3

import boto3
import json


def on_event(event, context):
    print(event)
    request_type = event["RequestType"]
    if request_type == "Create":
        return on_create(event)
    if request_type == "Update":
        return on_update(event)
    if request_type == "Delete":
        return on_delete(event)
    raise Exception("Invalid request type: %s" % request_type)


def on_create(event):
    props = event["ResourceProperties"]
    print("create new resource with props %s" % props)
    stack_name = props["stackName"]
    region_name = props["regionName"]
    client = boto3.client("cloudformation", region_name=region_name)
    response = client.describe_stacks(StackName=stack_name)
    print(response["Stacks"][0].get("Outputs"))
    outputs = response["Stacks"][0].get("Outputs")
    output = {}
    for o in outputs:
        output[o.get("OutputKey")] = o.get("OutputValue")
    print(output)

    # add your create code here...
    physical_id = stack_name
    return {"PhysicalResourceId": physical_id, "Data": output}


def on_update(event):
    physical_id = event["PhysicalResourceId"]
    props = event["ResourceProperties"]
    print("update resource %s with props %s" % (physical_id, props))
    stack_name = props["stackName"]
    region_name = props["regionName"]
    print("on_update describing %s from %s", stack_name, region_name)
    client = boto3.client("cloudformation", region_name=region_name)
    response = client.describe_stacks(StackName=stack_name)
    print(response["Stacks"][0].get("Outputs"))
    outputs = response["Stacks"][0].get("Outputs")
    output = {}
    for o in outputs:
        output[o.get("OutputKey")] = o.get("OutputValue")
    print(output)

    # add your create code here...
    physical_id = stack_name
    return {"PhysicalResourceId": physical_id, "Data": output}


def on_delete(event):
    physical_id = event["PhysicalResourceId"]
    print("delete resource %s" % physical_id)
    # ...
