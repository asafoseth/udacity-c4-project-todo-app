import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';


const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODO_TABLE,
        private readonly todosIndex = process.env.INDEX_NAME
    ) {}

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Initiated Get all ToDos function')

        const result = await this.docClient
        .query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
        .promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem>{
        logger.info('Initiated Create ToDo function')

        const feedback = await this.docClient
        .put({
            TableName: this.todosTable,
            Item: todoItem
        })
        .promise
        logger.info('Created ToDo item', feedback)

        return todoItem as TodoItem
    }

    async updateTodoItem(
        todoId: string,
        todoUpdate: TodoUpdate,
        userId: string
    ): Promise<TodoUpdate> {
        logger.info('Initiated Todo Update function')

        const result = await this.docClient
        .update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ReturnValues: 'ALL_NEW'
        })
        .promise()

        const todoUpdateItem = result.Attributes
        logger.info('Todo item updated', todoUpdateItem)
        return todoUpdateItem as TodoUpdate
    
    }

    async deleteTodoItem(todoId: string, userId: string): Promise<string> {
        logger.info('Initiate Delete todo item function')

        const result = await this.docClient
        .delete({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        })
        .promise()
        logger.info('Todo item deleted', result)
        return todoId as string
    }

    async updateTodoAttachmentUrl(
        todoId: string,
        userId: string,
        attachmentUrl: string
    ): Promise<void> {
        logger.info('Initiated Todo attachment url update function')

        await this.docClient
        .update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            }
        })
        .promise()
    }
}

