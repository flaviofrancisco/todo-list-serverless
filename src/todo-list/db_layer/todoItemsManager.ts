import * as AWS  from 'aws-sdk'
//import * as uuid from 'uuid'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from './todoItems'
import { UpdateTodoItem } from './updateTodoItem'
import { CreateTodoResponse } from '../responses/CreateToDoItemResponse'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const userIdIndex = process.env.USER_ID_INDEX
// const urlExpiration = process.env.SIGNED_URL_EXPIRATION
// const bucketName = process.env.IMAGES_S3_BUCKET

// const s3 = new XAWS.S3({
//   signatureVersion: 'v4'
// })

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

        //const imageId = uuid.v4()

        //todoItem.attachmentUrl = getUploadUrl(imageId);

        await this.docClient.put({
          TableName: this.todoItemsTable,
          Item: todoItem
        }).promise()
    
        return {
          ...todoItem
        }
      }  
      
      async updateTodo(todoItem: UpdateTodoItem): Promise<TodoItem> {
        await this.docClient.update({
          TableName:this.todoItemsTable,
          Key:{
              todoId: todoItem.id,
              userId: todoItem.userId
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
              todoId: id,
              userId: userId
          }
        }).promise()

        console.log('getTodo', result);

        return {
          todoId: result.Item['id'],
          createdAt: result.Item['createdAt'],
          done: result.Item['done'],
          dueDate: result.Item['dueDate'],
          name: result.Item['name'],
          userId: result.Item['userId'],
          attachmentUrl: result.Item['attachmentUrl']
        };
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

  // function getUploadUrl(imageId: string) {
  //   return s3.getSignedUrl('putObject', {
  //     Bucket: bucketName,
  //     Key: imageId,
  //     Expires: +urlExpiration
  //   })
  // }