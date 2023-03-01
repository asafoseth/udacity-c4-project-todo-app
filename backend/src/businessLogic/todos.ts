import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate';

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

// Implement the Create TODO function
export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    logger.info('Initiated todo function')

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const dueDate = new Date().toISOString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
    const newItem = {
        todoId,
        createdAt,
        ...newTodo,
        dueDate,
        done: false,
        attachmentUrl: s3AttachmentUrl,
        userId
    }

    return await todosAccess.createTodoItem(newItem)
}

// Implement Get TODO function
export async function getUserTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Initiated function to Get User Todos')
    return todosAccess.getAllTodos(userId)
}

// Implement Update TODO function
export async function updateTodo(
    todoId: string,
    todoUpdate: UpdateTodoRequest,
    userId: string
    ): Promise<TodoUpdate> {
        logger.info('Initiated Update Todo function')
        return todosAccess.updateTodoItem(todoId, todoUpdate, userId)
    }

// Implement Delete TODO function
export async function deleteTodo(
    todoId: string,
    userId: string
): Promise<string> {
    logger.info('Initiate Delete Todo function')
    return todosAccess.deleteTodoItem(todoId, userId)
}

// Implement Cretae attachement function
export async function createAttachmentPresignedUrl(
    todoId: string,
    userId: string
    ): Promise<string> {
        logger.info('Initiated create attachment function for', userId, todoId)
        return attachmentUtils.getUploadUrl(todoId)  
}