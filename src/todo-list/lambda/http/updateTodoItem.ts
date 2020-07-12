import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/updateTodoItemRequest'
import { updateTodo } from '../../controllers/todoItemsController'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    console.log('Processing event: ', event)

  const todoItemToUpdate: UpdateTodoRequest = JSON.parse(event.body)

  const todoItemUpdated = await updateTodo(todoItemToUpdate)

  try {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        todoItemUpdated
      })
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