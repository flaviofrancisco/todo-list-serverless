import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoItemRequest } from '../../requests/UpdateTodoItemRequest'
import { updateTodo } from '../../controllers/todoItemsController'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    console.log('Processing event: ', event)

  const todoItemToUpdate: UpdateTodoItemRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const todoItemUpdated = await updateTodo(todoItemToUpdate, jwtToken)

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        todoItemUpdated
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