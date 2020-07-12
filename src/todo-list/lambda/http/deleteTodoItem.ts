import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTodo } from '../../controllers/todoItemsController'
import { DeleteTodoItemRequest } from '../../requests/deleteTodoItemRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    console.log('Processing event: ', event)

  const deleteTodoItemRequest: DeleteTodoItemRequest = JSON.parse(event.body)

  const success = await deleteTodo(deleteTodoItemRequest.id)

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