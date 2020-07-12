import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from './todoItems'
import { UpdateTodoItem } from './updateTodoItem'

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
      
      async updateTodo(todoItem: UpdateTodoItem): Promise<TodoItem> {
        await this.docClient.update({
          TableName:this.todoItemsTable,
          Key:{
              "id": todoItem.id,
              "userId": todoItem.userId
          },
          UpdateExpression: "set dueDate = :dueDate, #n=:n, done=:done, attachmentUrl=:attachmentUrl",
          ExpressionAttributeValues:{
              ":dueDate":todoItem.dueDate,
              ":n":todoItem.name,
              ":done":todoItem.done,
              ":attachmentUrl":todoItem.attachmentUrl
          },
          ExpressionAttributeNames: {
            "#n": "name"
          },
          ReturnValues:"UPDATED_NEW"
        }).promise()

        return await this.getTodo(todoItem.id, todoItem.userId);

      }
      
      async getTodo(id: string, userId: string): Promise<TodoItem> {

        const result = await this.docClient.get({
          TableName: this.todoItemsTable,
          Key:{
              id: id,
              userId: userId
          }
        }).promise()

        console.log('getTodo', result);

        return {
          id: result.Item['id'],
          createdAt: result.Item['createdAt'],
          done: result.Item['done'],
          dueDate: result.Item['dueDate'],
          name: result.Item['name'],
          userId: result.Item['userId'],
          attachmentUrl: result.Item['attachmentUrl']
        };
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
