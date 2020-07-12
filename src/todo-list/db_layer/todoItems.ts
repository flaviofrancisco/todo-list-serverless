export interface TodoItem {
    id: string
    createdAt: string
    name: string
    dueDate: string
    done: boolean
    attachmentUrl?: string,
    userId: string
}