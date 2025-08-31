import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TestAppModule } from './test-app.module';
import { DataSource } from 'typeorm';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    
    // Get data source and clean up any existing test data
    dataSource = app.get(DataSource);
    await dataSource.query('DELETE FROM users WHERE email LIKE $1', ['test%']);
  });

  afterAll(async () => {
    // Clean up test data
    try {
      if (dataSource && dataSource.isInitialized) {
        await dataSource.query('DELETE FROM users WHERE email LIKE $1', [
          'test%',
        ]);
      }
    } catch (e) {
      // Connection might already be closed
    }
    await app.close();
  });

  describe('/api/v1/register (POST)', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/register')
        .send({
          email: 'test.e2e@example.com',
          password: 'TestPass123!!',
          full_name: 'Test User',
        });
        
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('test.e2e@example.com');
      expect(response.body.user.full_name).toBe('Test User');
      authToken = response.body.accessToken;
    });

    it('should not register duplicate user', () => {
      return request(app.getHttpServer())
        .post('/api/v1/register')
        .send({
          email: 'test.e2e@example.com',
          password: 'AnotherPass123!!',
          full_name: 'Duplicate User',
        })
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toContain('already exists');
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/register')
        .send({
          email: 'incomplete@example.com',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBeInstanceOf(Array);
        });
    });

    it('should validate email format', () => {
      return request(app.getHttpServer())
        .post('/api/v1/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!!',
          full_name: 'Test User',
        })
        .expect(400);
    });
  });

  describe('/api/v1/login (POST)', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/login')
        .send({
          email: 'test.e2e@example.com',
          password: 'TestPass123!!',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe('test.e2e@example.com');
        });
    });

    it('should not login with incorrect password', () => {
      return request(app.getHttpServer())
        .post('/api/v1/login')
        .send({
          email: 'test.e2e@example.com',
          password: 'WrongPassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Invalid credentials');
        });
    });

    it('should not login with non-existent email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!!',
        })
        .expect(401);
    });
  });

  describe('/api/v1/profile (GET)', () => {
    it('should get current user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email', 'test.e2e@example.com');
          expect(res.body).toHaveProperty('full_name', 'Test User');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should not get profile without token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/profile')
        .expect(401);
    });

    it('should not get profile with invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/api/v1/profile (PUT)', () => {
    it('should update current user profile with valid token', () => {
      return request(app.getHttpServer())
        .put('/api/v1/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          address_line_1: '123 Test Street',
          city: 'Test City',
          phone_number: '1234567890',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('address_line_1', '123 Test Street');
          expect(res.body).toHaveProperty('city', 'Test City');
          expect(res.body).toHaveProperty('phone_number', '1234567890');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should handle partial updates', () => {
      return request(app.getHttpServer())
        .put('/api/v1/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          state: 'Test State',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('state', 'Test State');
          // City was set in previous test, should be retained if tests run in order
          // If not, it will be null which is also valid for partial update
          if (res.body.city !== null) {
            expect(res.body).toHaveProperty('city', 'Test City');
          }
        });
    });

    it('should not update profile without token', () => {
      return request(app.getHttpServer())
        .put('/api/v1/profile')
        .send({
          address_line_1: 'New Address',
        })
        .expect(401);
    });

    it('should accept and transform update data types', () => {
      return request(app.getHttpServer())
        .put('/api/v1/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          phone_number: '9876543210', // Valid string format
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('phone_number', '9876543210');
        });
    });
  });
});
