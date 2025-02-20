import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserProvider } from "../contexts/UserContext";
import LoginPage from "../pages/LoginPage";
import { loginUser } from "../utils/api";

const request = require('supertest');
const app = require('../src/server'); // Update path based on your server file location
const db = require('../src/db/models'); // Update path based on your models location

describe('Auth Routes', () => {
  // Before all tests, sync database
  beforeAll(async () => {
    await db.sequelize.sync({ force: true }); // This will recreate tables
  });

  // After all tests, close database connection
  afterAll(async () => {
    await db.sequelize.close();
  });

  // Clear users table before each test
  beforeEach(async () => {
    await db.User.destroy({ where: {} });
  });

  describe('POST /api/auth/signup', () => {
    const validUser = {
      username: 'testapp',
      password: 'testapp123',
      firstName: 'Test',
      lastName: 'App',
      email: 'testapp@example.com'
    };

    it('should create a new user and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', 'testapp');
      expect(response.body.user).not.toHaveProperty('password'); // Password should not be returned
    });

    it('should return an error if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testapp'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'All fields required');
    });

    it('should return an error if username already exists', async () => {
      // First create a user
      await request(app)
        .post('/api/auth/signup')
        .send(validUser);

      // Try to create the same user again
      const response = await request(app)
        .post('/api/auth/signup')
        .send(validUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      username: 'testapp',
      password: 'testapp123',
      firstName: 'Test',
      lastName: 'App',
      email: 'testapp@example.com'
    };

    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);
    });

    it('should log in an existing user and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('username', testUser.username);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return an error for invalid username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistentuser',
          password: 'testapp123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid username or password');
    });

    it('should return an error for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid username or password');
    });
  });
});

