'use server'

import { ArrayType, NotificationType, Query } from "@/lib/people.db.types"
import { DynamoDBClient, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { sendSms } from "./notifications";

const TABLE_NAME = 'People'

type Notification = 'Invitation' | 'Gallery'
type FetchOptions = {
  invalidateCache?: boolean
  devMode?: boolean
}
const dynamoClient = new DynamoDBClient({ region: process.env.REGION });
const command = new ScanCommand({
  TableName: TABLE_NAME,
});
let cachedResponse: Query | undefined

export async function fetchPeople(options?: FetchOptions): Promise<Query> {
  if (options?.devMode) {
    cachedResponse = MOCK_DATA
  }
  if (options?.invalidateCache || cachedResponse === undefined) {
    const response = await dynamoClient.send(command);
    cachedResponse = response as unknown as Query
  }
  return cachedResponse
}

export async function sendNotification(identifier: string, topic: Notification = 'Invitation') {
  const user = cachedResponse?.Items?.find(({ id }) => id.S === identifier)
  if (!user) throw new Error(`Person not found. Identifier <${identifier}> `)
  let notifications: ArrayType<NotificationType> | undefined = user.notifications
  if (!notifications) {
    notifications = {
      L: []
    }
  }
  await sendSms(user.phoneNumber.S, identifier)
  notifications.L.push({
    M: {
      topic: {
        S: topic
      },
      datetime: {
        S: String(Date.now())
      }
    }
  })
  const updateUserCommand = new UpdateItemCommand({
    TableName: TABLE_NAME,
    Key: { id: user.id },
    AttributeUpdates: {
      notifications: {
        Action: 'PUT',
        Value: notifications
      }
    }
  })
  await dynamoClient.send(updateUserCommand)
}

const MOCK_DATA = {
  "$metadata": {
    "httpStatusCode": 200,
    "requestId": "4Q9798K3BSP57EB5FS49T3JQP3VV4KQNSO5AEMVJF66Q9ASUAAJG",
    "attempts": 1,
    "totalRetryDelay": 0
  },
  "Count": 1,
  "Items": [{
    "id": {
      "S": "testing-identifier"
    },
    "additionalPeople": {
      "N": "0"
    },
    "address": {
      "S": ""
    },
    "isAssisting": {
      "BOOL": false
    },
    "more": {
      "N": "2"
    },
    "name": {
      "S": "Testing user"
    },
    "notifications": {
      "L": [
        {
          "M": {
            "datetime": {
              "S": "1695179502769"
            },
            "topic": {
              "S": "Invitation"
            }
          }
        }
      ]
    },
    "phoneNumber": {
      "S": "625360587"
    }
  }],
  "ScannedCount": 1
}