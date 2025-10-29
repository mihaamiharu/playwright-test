import { test, expect } from '@playwright/test';

// We can add tags at the 'describe' level.
// All tests inside this block will inherit '@regression' and '@todo'.
test.describe('TodoMVC App', { tag: ['@regression', '@todo'] }, () => {

  // This hook still runs before each test in the suite.
  test.beforeEach(async ({ page }) => {
    // Go to the target application
    await page.goto('https://demo.playwright.dev/todomvc/');
  });

  // Test Case 1: Create a new todo item
  test('should allow me to add a new todo item', {
    tag: ['@smoke', '@create']
  }, async ({ page }) => {
    // 1. Get the locator for the "new todo" input field
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // 2. Fill it with text and press "Enter"
    await newTodo.fill('Buy milk');
    await newTodo.press('Enter');

    // 3. Assertion: Check that the new item exists in the list
    const todoList = page.getByTestId('todo-list');
    await expect(todoList).toBeVisible();
    await expect(page.getByText('Buy milk')).toBeVisible();
  });

  // Test Case 2: Mark one as completed
  test('should allow me to mark an item as completed', {
    tag: '@complete' // A single tag can be a string
  }, async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // 1. Setup: Create two items
    await newTodo.fill('Buy milk');
    await newTodo.press('Enter');
    await newTodo.fill('Clean the house');
    await newTodo.press('Enter');

    // 2. Find the "Buy milk" item
    const milkItem = page.getByTestId('todo-item').filter({ hasText: 'Buy milk' });

    // 3. Action: Click the checkbox
    await milkItem.getByRole('checkbox').check();

    // 4. Assertion: Check for 'completed' class
    await expect(milkItem).toHaveClass('completed');

    // 5. Assertion: Check the other item is not completed
    const houseItem = page.getByTestId('todo-item').filter({ hasText: 'Clean the house' });
    await expect(houseItem).not.toHaveClass('completed');
  });

  // Test Case 3: Create and then delete an item
  test('should allow me to delete a todo item', {
    tag: ['@smoke', '@delete']
  }, async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // 1. Setup: Create an item
    await newTodo.fill('Read a book');
    await newTodo.press('Enter');

    // 2. Assertion: Verify it exists
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Read a book' });
    await expect(todoItem).toBeVisible();

    // 3. Action: Hover and click the delete button
    await todoItem.hover();
    await todoItem.getByRole('button', { name: 'Delete' }).click();

    // 4. Assertion: Check that the item is hidden
    await expect(todoItem).toBeHidden();
    
    // 5. Assertion: Check that the list is empty
    await expect(page.getByTestId('todo-list')).toBeEmpty();
  });
});