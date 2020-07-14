import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteTodo } from '../../controllers/todoItemsController';

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log('Processing event: ', event)

  const todoItemId = event.pathParameters.id;
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
    
  const success = await deleteTodo(todoItemId, jwtToken);

  try {
    if (success) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Deleted successfully'
            })
            }
    } else {
        throw new Error('Something bad happened');
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