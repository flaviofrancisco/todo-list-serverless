import * as uuid from 'uuid'

import { ToDoItemsManager } from "../db_layer/todoItemsManager";
import { TodoItem } from "../db_layer/todoItems";
import { CreateTodoRequest } from "../requests/CreateToDoItemRequest";

const todoItemsManager = new ToDoItemsManager()

export async function getAllTodoItems(): Promise<TodoItem[]> {
    return todoItemsManager.getAllToDoItems();
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest    
  ): Promise<TodoItem> {
  
    const itemId = uuid.v4()
    //const userId = getUserId(jwtToken)
  
    return await todoItemsManager.createTodo({
      id: itemId,
      userId: 'c9cc949f-dfec-4714-b25d-b0e239e01873',
      name: createTodoRequest.name,      
      createdAt: new Date().toISOString(),
      dueDate: createTodoRequest.dueDate,
      done: false,
      attachmentUrl: null
    })
  }