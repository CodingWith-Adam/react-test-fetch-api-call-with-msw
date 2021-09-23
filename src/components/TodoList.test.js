import { screen, render } from "@testing-library/react";
import TodoList, { todoUrl, userUrl } from "./TodoList";

import { rest } from "msw";
import { setupServer } from "msw/node";

const todoResponse = rest.get(todoUrl, (req, res, ctx) => {
  return res(
    ctx.json([
      { id: 1, userId: 1, title: "clean room", completed: true },
      { id: 2, userId: 2, title: "clean car", completed: true },
    ])
  );
});

const todoErrorResponse = rest.get(todoUrl, (req, res, ctx) => {
  return res(ctx.status(500));
});

const userResponse = rest.get(userUrl, (req, res, ctx) => {
  return res(
    ctx.json([
      { id: 1, name: "Bruce Banner" },
      { id: 2, name: "Clark Kent" },
    ])
  );
});

const handlers = [todoResponse, userResponse];

const server = new setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("it should have the correct todo item clean room", async () => {
  render(<TodoList />);
  const todoItem = await screen.findByText("clean room");
  expect(todoItem).toBeVisible();
});

test("it should have correct user Bruce Banner", async () => {
  render(<TodoList />);
  const todoItem = await screen.findByText("Bruce Banner");
  expect(todoItem).toBeVisible();
});

test("it should have the correct todo item clean car", async () => {
  render(<TodoList />);
  const todoItem = await screen.findByText("clean car");
  expect(todoItem).toBeVisible();
});

test("it should have correct user Clark Kent", async () => {
  render(<TodoList />);
  const todoItem = await screen.findByText("Clark Kent");
  expect(todoItem).toBeVisible();
});

test("it should handle error message from todo", async () => {
  server.use(todoErrorResponse);
  render(<TodoList />);
  const todoItem = await screen.findByText("Opps come back later");
  expect(todoItem).toBeVisible();
});
