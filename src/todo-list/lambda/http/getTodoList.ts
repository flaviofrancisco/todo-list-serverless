import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllTodoItems } from '../../controllers/todoItemsController'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    console.log('Processing event: ', event)

    try {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify({ items: await getAllTodoItems() })
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