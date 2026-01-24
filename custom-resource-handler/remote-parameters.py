
#!/usr/bin/env python3

import boto3
from boto3.session import Session
from botocore.exceptions import ClientError
import traceback

def get_ssm_client(region_name, role_arn=None, session_name=None):
    if role_arn:
        sts_client = boto3.client('sts')
        response = sts_client.assume_role(RoleArn=role_arn, RoleSessionName=session_name)
        session = Session(aws_access_key_id=response['Credentials']['AccessKeyId'],
                    aws_secret_access_key=response['Credentials']['SecretAccessKey'],
                    aws_session_token=response['Credentials']['SessionToken'])
        client = session.client("ssm", region_name=region_name)
    else:
        client = boto3.client("ssm", region_name=region_name)
    return client

def get_parameters(region_name, path, role_arn=None, session_name=None):
    client = get_ssm_client(region_name, role_arn, session_name)
    result = []

    try:
        response = client.get_parameter(
            Name=path,
            WithDecryption=True,
        )
        if response["Parameter"]:
            result += [response["Parameter"]]
    except ClientError as e:
        if e.response['Error']['Code'] == 'ValidationException':
            traceback.print_exc()
        else:
            raise

    try:
        paginator = client.get_paginator('get_parameters_by_path')
        response_iterator = paginator.paginate(
            Path=path,
            Recursive=True,
            WithDecryption=True,
            PaginationConfig={
                'MaxItems': 100,
                'PageSize': 10,
            }
        )
        for x in response_iterator:
            result += x["Parameters"]
    except ClientError as e:
        # Continue when ValidationException due to parameters without slashes
        if e.response['Error']['Code'] == 'ValidationException':
            traceback.print_exc()
        else:
            raise
    output = {}
    for x in result:
        output[x["Name"]] = x["Value"]
    return output

def on_event(event, context):
    print(event)
    request_type = event.get("RequestType")
    if request_type == "Create":
        return on_create(event)
    if request_type == "Update":
        return on_update(event)
    if request_type == "Delete":
        return on_delete(event)
    raise Exception("Invalid request type: %s" % request_type)


def on_create(event):
    props = event.get("ResourceProperties")
    print("create new resource with props %s" % props)
    stack_name = props.get("stackName")
    region_name = props.get("regionName")
    path = props.get("parameterPath")
    role = props.get("role")
    output = get_parameters(region_name, path, role_arn=role, session_name=stack_name)
    return {"Data": output}


def on_update(event):
    physical_id = event.get("PhysicalResourceId")
    props = event.get("ResourceProperties")
    print("update resource %s with props %s" % (physical_id, props))
    stack_name = props.get("stackName")
    region_name = props.get("regionName")
    print("on_update in progress")
    path = props.get("parameterPath")
    role = props.get("role")
    output = get_parameters(region_name, path, role_arn=role, session_name=stack_name)
    return {"PhysicalResourceId": physical_id, "Data": output}


def on_delete(event):
    physical_id = event.get("PhysicalResourceId")
    print("delete resource %s" % physical_id)
