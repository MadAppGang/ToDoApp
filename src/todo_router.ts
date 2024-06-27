import { Hono } from 'hono'
import { type Todo } from './model.ts'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const updateScheme = z.object({
  title: z.string().trim().min(1).optional(),
  completed: z.boolean().optional()
}).refine((data) => {
  return data.title || data.completed
}, { message: 'title or completed is required' })

const todoRouter = () => {

  const storage = new Map<string, Todo[]>()

  const router = new Hono();

  router.get('/:user_id/todo', (c) => {
    return c.json(storage.get(c.req.param('user_id')) ?? [])
  })

  router.post('/:user_id/todo', async (c) => {
    const userId = c.req.param('user_id')
    if (!userId) {
      return c.json({ error: 'user_id is required' }, 400)
    }
    const body = await c.req.json()
    if (!body.title) {
      return c.json({ error: 'title is required' }, 400)
    }

    const todo: Todo = {
      id: crypto.randomUUID(),
      title: body.title.trim(),
      completed: false
    }
    if (storage.has(userId)) {
      storage.get(userId)?.push(todo)
    } else {
      storage.set(userId, [todo])
    }
    return c.json(todo)
  })

  router.patch('/:user_id/todo/:todo_id', zValidator('json', updateScheme),  (c) => {
    const userId = c.req.param('user_id')
    const todoId = c.req.param('todo_id')
    if (!userId || !todoId) {
      return c.json({ error: 'user_id and todo_id are required' }, 400)
    }
    const body = c.req.valid("json")

    const todo = storage.get(userId)?.find((t) => t.id === todoId)
    if (!todo) {
      return c.json({ error: 'todo not found' }, 404)
    }

    if (body.title) {
      todo.title = body.title.trim()
    }
    if (body.completed) {
      todo.completed = body.completed
    }
    return c.json(todo)
  })

  router.delete('/:user_id/todo/:todo_id', async (c) => {
    const userId = c.req.param('user_id')
    const todoId = c.req.param('todo_id')
    if (!userId || !todoId) {
      return c.json({ error: 'user_id and todo_id are required' }, 400)
    }

    const todo = storage.get(userId)?.find((t) => t.id === todoId)
    if (!todo) {
      return c.json({ error: 'todo not found' }, 404)
    }

    storage.get(userId)?.splice(storage.get(userId)?.indexOf(todo) ?? -1, 1)
    return c.json({message: "todo deleted"})
  })

  return router
}

export default todoRouter;
