import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getTodo } from '../../controllers/todoItemsController'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    console.log('Processing event: ', event)

    const todoItemId = event.pathParameters.id;
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const item = await getTodo(todoItemId, jwtToken)

    try {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ item })
        }    
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true 
            },
            body: JSON.stringify({ error })
        }
    }

})

handler.use(
    cors({
      credentials: true
    })
  )