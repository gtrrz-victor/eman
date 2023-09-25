const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = async (event, context) => {
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
    };

    try {
        switch (event.httpMethod) {
            case 'OPTIONS':
                return {
                    statusCode,
                    headers
                }
            case 'GET':
                body = await dynamo.get({
                    TableName: 'People',
                    Key: { id: event.pathParameters.id }
                }).promise();
                if (body.Item?.relatives) {
                    const relatives = await dynamo.scan({
                        TableName: 'People',
                        AttributesToGet: ['name'],
                        ScanFilter: {
                            'id': {
                                ComparisonOperator: 'IN',
                                AttributeValueList: body.Item.relatives
                            }
                        }
                    }).promise()
                    body.Item?.relatives = relatives.Items?.map(({ name }) => name)
                }
                break;
            case 'PATCH':
                const payload = JSON.parse(event.body)
                const personaChanges = Object.keys(payload).reduce((prev, key) => ({
                    ...prev,
                    [key]: {
                        Action: 'PUT',
                        Value: payload[key]
                    }
                }), {})
                body = await dynamo.update({
                    TableName: 'People',
                    Key: { id: event.pathParameters.id },
                    AttributeUpdates: {
                        ...personaChanges
                    }

                }).promise();
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    }
    catch (err) {
        statusCode = '400';
        body = err.message;
    }
    finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
