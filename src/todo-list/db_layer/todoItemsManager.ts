import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from './todoItems'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class ToDoItemsManager {
    
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoItemsTable = process.env.TODOS_TABLE
    ) { }

    async getAllToDoItems(): Promise<TodoItem[]> {
        console.log('Getting all to do items')

        const result = await this.docClient.scan({
          TableName: this.todoItemsTable
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
