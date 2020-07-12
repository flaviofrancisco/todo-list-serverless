import * as uuid from 'uuid'

import { ToDoItemsManager } from "../db_layer/todoItemsManager";
import { TodoItem } from "../db_layer/todoItems";
import { CreateTodoRequest } from "../requests/CreateToDoItemRequest";
import { UpdateTodoRequest } from '../requests/UpdateTodoItemRequest';

const todoItemsManager = new ToDoItemsManager()
const userId = 'c9cc949f-dfec-4714-b25d-b0e239e01873'

export async function getAllTodoItems(): Promise<TodoItem[]> {
    return todoItemsManager.getAllToDoItems(userId);
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest    
  ): Promise<TodoItem> {
  
    const itemId = uuid.v4()
    //const userId = getUserId(jwtToken) 

    return await todoItemsManager.createTodo({
      id: itemId,
      userId: userId,
      name: createTodoRequest.name,      
      createdAt: new Date().toISOString(),
      dueDate: createTodoRequest.dueDate,
      done: false,
      attachmentUrl: null
    })
  }

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest
): Promise<TodoItem> {
  return await todoItemsManager.updateTodo({
    done: updateTodoRequest.done,
    dueDate: updateTodoRequest.dueDate,
    id: updateTodoRequest.id,
    name: updateTodoRequest.name,
    userId: userId,
    attachmentUrl: updateTodoRequest.attachmentUrl
  });
}
