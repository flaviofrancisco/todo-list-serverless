import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getTodo } from '../../controllers/todoItemsController'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    console.log('Processing event: ', event)

    const todoItemId = event.pathParameters.id;
    const item = await getTodo(todoItemId)

    try {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify({ item })
        }    
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify({ error })
        }
    }

}