import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createTodo } from '../../controllers/todoItemsController'
import { CreateTodoRequest } from '../../requests/CreateToDoItemRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    console.log('Processing event: ', event)

  const newTodoItem: CreateTodoRequest = JSON.parse(event.body)

  const newItem = await createTodo(newTodoItem)

  try {
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
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