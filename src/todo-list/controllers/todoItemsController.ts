import * as uuid from 'uuid'

import { ToDoItemsManager } from "../db_layer/todoItemsManager";
import { TodoItem } from "../db_layer/todoItems";
import { CreateTodoItemRequest } from "../requests/CreateTodoItemRequest";
import { UpdateTodoItemRequest } from '../requests/UpdateTodoItemRequest';
import { getUserId } from '../../auth/utils';

const todoItemsManager = new ToDoItemsManager()

export async function getAllTodoItems(jwtToken: string): Promise<TodoItem[]> {
    const userId = getUserId(jwtToken) 
    return todoItemsManager.getAllToDoItems(userId);
}

export async function createTodo(
    createTodoRequest: CreateTodoItemRequest,
    jwtToken: string    
  ): Promise<TodoItem> {
  
    const itemId = uuid.v4()
    const userId = getUserId(jwtToken) 

    return await todoItemsManager.createTodo({
      todoId: itemId,
      userId: userId,
      name: createTodoRequest.name,      
      createdAt: new Date().toISOString(),
      dueDate: createTodoRequest.dueDate,
      done: false
    })
  }

export async function updateTodo(
  updateTodoRequest: UpdateTodoItemRequest,
  jwtToken: string
): Promise<TodoItem> {
  const userId = getUserId(jwtToken)
  return await todoItemsManager.updateTodo({
    done: updateTodoRequest.done,
    dueDate: updateTodoRequest.dueDate,
    id: updateTodoRequest.id,
    name: updateTodoRequest.name,
    userId: userId,
    attachmentUrl: updateTodoRequest.attachmentUrl
  });
}

export async function saveImage(imageId: string): Promise<void> {
  await todoItemsManager.saveImage(imageId);
}

export async function deleteTodo(
  id:string,
  jwtToken: string
): Promise<boolean> {
  const userId = getUserId(jwtToken)
  return await todoItemsManager.deleteTodo(id, userId);
}

export async function getTodo(
  id:string,
  jwtToken: string
): Promise<TodoItem> {
  const userId = getUserId(jwtToken)
  return await todoItemsManager.getTodo(id, userId);
}