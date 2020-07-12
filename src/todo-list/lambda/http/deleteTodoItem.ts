import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteTodo } from '../../controllers/todoItemsController';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log('Processing event: ', event)

  const todoItemId = event.pathParameters.id;
  const success = await deleteTodo(todoItemId);

  try {
    if (success) {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
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
      headers: {
          'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify({ error })
  }   
  }
}