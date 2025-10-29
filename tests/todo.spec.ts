import { test, expect } from '@playwright/test';

test.describe('TodoMVC App', { tag: ['@regression', '@todo'] }, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
  });

  test('should allow me to add a new todo item', {
    tag: ['@smoke', '@create']
  }, async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');
    await newTodo.fill('Buy milk');
    await newTodo.press('Enter');

    const todoList = page.getByTestId('todo-list');
    await expect(todoList).toBeVisible();
    await expect(page.getByText('Buy milk')).toBeVisible();
  });

  test('should allow me to mark an item as completed', {
    tag: '@complete'
  }, async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    await newTodo.fill('Buy milk');
    await newTodo.press('Enter');
    await newTodo.fill('Clean the house');
    await newTodo.press('Enter');

    const milkItem = page.getByTestId('todo-item').filter({ hasText: 'Buy milk' });
    await milkItem.getByRole('checkbox').check();

    await expect(milkItem).toHaveClass('completed');

    const houseItem = page.getByTestId('todo-item').filter({ hasText: 'Clean the house' });
    await expect(houseItem).not.toHaveClass('completed');
  });

  test('should allow me to delete a todo item', {
    tag: ['@smoke', '@delete']
  }, async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    await newTodo.fill('Read a book');
    await newTodo.press('Enter');

    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Read a book' });
    await expect(todoItem).toBeVisible();

    await todoItem.hover();
    await todoItem.getByRole('button', { name: 'Delete' }).click();

    await expect(todoItem).toBeHidden();
    
    await expect(page.getByTestId('todo-list')).toBeEmpty();
  });
});