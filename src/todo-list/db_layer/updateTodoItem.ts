export interface UpdateTodoItem {
    id: string
    name: string
    dueDate: string
    done: boolean
    attachmentUrl?: string,
    userId: string
}