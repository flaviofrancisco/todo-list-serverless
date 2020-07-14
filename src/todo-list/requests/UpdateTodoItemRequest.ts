export interface UpdateTodoItemRequest {
    id: string,
    name: string
    dueDate: string,
    attachmentUrl: string,
    done: boolean    
  }