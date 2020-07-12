import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from './todoItems'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const userIdIndex = process.env.USER_ID_INDEX

export class ToDoItemsManager {
    
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoItemsTable = process.env.TODOS_TABLE
    ) { }

    async getAllToDoItems(userId: string): Promise<TodoItem[]> {
        
        console.log('Getting all to do items')

        const result = await this.docClient.query({
          TableName: this.todoItemsTable,
          IndexName: userIdIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId' : userId
          },
          ScanIndexForward: false
        }).promise()
    
        const items = result.Items
        return items as TodoItem[]
      }
      
      async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
          TableName: this.todoItemsTable,
          Item: todoItem
        }).promise()
    
        return todoItem
      }        
        
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
