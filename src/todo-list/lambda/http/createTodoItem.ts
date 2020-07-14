import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createTodo } from '../../controllers/todoItemsController'
import { CreateTodoItemRequest } from '../../requests/CreateTodoItemRequest'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log('Processing event: ', event)

  const newTodoItem: CreateTodoItemRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newItem = await createTodo(newTodoItem, jwtToken)

  try {
    return {
      statusCode: 201,
      body: JSON.stringify({
        newItem
      })
    }  
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error })
    }   
  }
})

handler.use(
  cors({
    credentials: true
  })
)