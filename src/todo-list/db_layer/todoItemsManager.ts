import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from './todoItems'
import { UpdateTodoItem } from './updateTodoItem'
import { CreateTodoResponse } from '../responses/CreateTodoResponse'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const userIdIndex = process.env.USER_ID_INDEX
const todoIdIndex = process.env.TODO_ID_INDEX
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const bucketName = process.env.IMAGES_S3_BUCKET

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

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
      
      async createTodo(todoItem: TodoItem): Promise<CreateTodoResponse> {

        todoItem.uploadUrl = getUploadUrl(todoItem.todoId);

        await this.docClient.put({
          TableName: this.todoItemsTable,
          Item: todoItem
        }).promise()
    
        return {
          ...todoItem
        }
      } 
      
      async saveImage(todoId: string): Promise<void> {
        
        const todoItem = await this.getTodoById(todoId);

        if (!todoItem) { return; }       

        await this.docClient.update({
          TableName:this.todoItemsTable,
          Key:{
              todoId: todoItem.todoId,
              userId: todoItem.userId
          },
          UpdateExpression: "set attachmentUrl=:attachmentUrl",
          ExpressionAttributeValues:{
              ":attachmentUrl":`https://${bucketName}.s3.amazonaws.com/${todoItem.todoId}`
          },
          ReturnValues:"UPDATED_NEW"
        }).promise()  
         
      }
      
      async updateTodo(todoItem: UpdateTodoItem): Promise<TodoItem> {

        todoItem.uploadUrl = getUploadUrl(todoItem.id);

        await this.docClient.update({
          TableName:this.todoItemsTable,
          Key:{
              todoId: todoItem.id,
              userId: todoItem.userId
          },
          UpdateExpression: "set dueDate = :dueDate, #n=:n, done=:done, uploadUrl=:uploadUrl",
          ExpressionAttributeValues:{
              ":dueDate":todoItem.dueDate,
              ":n":todoItem.name,
              ":done":todoItem.done,              
              ":uploadUrl":todoItem.uploadUrl
          },
          ExpressionAttributeNames: {
            "#n": "name"
          },
          ReturnValues:"UPDATED_NEW"
        }).promise()

        return await this.getTodo(todoItem.id, todoItem.userId);

      }
      
      async getTodoById(id: string): Promise<TodoItem> {

        const result = await this.docClient.query({
          TableName: this.todoItemsTable,
          IndexName: todoIdIndex,
          KeyConditionExpression: 'todoId = :id',
          ExpressionAttributeValues: {
            ':id' : id
          },
          ScanIndexForward: false
        }).promise()

        console.log('Todo Item Query...', result);  

        if (result.Items && result.Items.length > 0) {
          return this.getTodoItem(result.Items[0]);
        }
        return null;    
      }

      async getTodo(id: string, userId: string): Promise<TodoItem> {

        const result = await this.docClient.get({
          TableName: this.todoItemsTable,
          Key:{
              todoId: id,
              userId: userId
          }
        }).promise()

        console.log('getTodo', result);

        return this.getTodoItem(result.Item);
      }

  private getTodoItem(item: any): TodoItem | PromiseLike<TodoItem> {
    return {
      todoId: item['todoId'],
      createdAt: item['createdAt'],
      done: item['done'],
      dueDate: item['dueDate'],
      name: item['name'],
      userId: item['userId'],
      attachmentUrl: item['attachmentUrl'],
      uploadUrl: item['uploadUrl']
    }
  }

      async deleteTodo(id: string, userId: string): Promise<boolean> {
        const result = await this.docClient.delete({
          TableName: this.todoItemsTable,
          Key:{
              todoId: id,
              userId: userId
          }
        }).promise();
        console.log('Deleted item', result);
        return true;
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

  function getUploadUrl(key: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: key,
      Expires: +urlExpiration
    })
  }