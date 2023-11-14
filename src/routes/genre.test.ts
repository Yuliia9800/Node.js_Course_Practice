import supertest from 'supertest';
import { Genre } from '../models/genre.model';
import { app } from '../app';

const request = supertest(app);

describe('[GENRE] API', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /', () => {
    it('should return list of genres', async () => {
      jest.spyOn(Genre, 'find').mockResolvedValue([]);

      const response = await request.get('/genres');

      expect(response.status).toBe(200);
    });
  });

  describe('POST /', () => {
    it('should return status 400 and errors', async () => {
      const genre = {};
      const response = await request.post('/genres').send(genre);

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(1);
    });

    it('should return status 404 if genre already exist', async () => {
      const genre = { name: 'post1' };
      jest.spyOn(Genre, 'findOne').mockResolvedValue(true);
      const response = await request.post('/genres').send(genre);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('That genre already exist');
    });

    it('should return status 200', async () => {
      const genre = { name: 'post1' };
      jest.spyOn(Genre, 'findOne').mockResolvedValue(false);
      jest.spyOn(Genre, 'create').mockReturnValue(genre as any);
      const response = await request.post('/genres').send(genre);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(genre);
    });

    it('should return status 500', async () => {
      const genre = { name: 'post1' };
      jest.spyOn(Genre, 'findOne').mockResolvedValue(false);
      jest.spyOn(Genre, 'create').mockRejectedValue(new Error('Mongoose error'));
      const response = await request.post('/genres').send(genre);

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /:id', () => {
    it('should return genre and update', async () => {
      const genre = { name: 'post1' };
      jest.spyOn(Genre, 'findByIdAndUpdate').mockResolvedValue(true);
      jest.spyOn(Genre, 'findById').mockResolvedValue(genre);
      const response = await request.put('/genres/123').send(genre);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(genre);
    });

    it('should return 404 if genre does not exist', async () => {
      const genre = { name: 'post1' };
      jest.spyOn(Genre, 'findByIdAndUpdate').mockResolvedValue(false);
      const response = await request.put('/genres/123').send(genre);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('cannot find any genre with ID 123');
    });

    it('should return 500', async () => {
      const genre = { name: 'post1' };
      jest.spyOn(Genre, 'findByIdAndUpdate').mockRejectedValue(new Error('Mongoose error'));
      const response = await request.put('/genres/123').send(genre);

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a genre and return a success message', async () => {
      jest.spyOn(Genre, 'findByIdAndDelete').mockResolvedValue(true);

      const response = await request.delete('/genres/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'genre has been deleted' });
    });

    it('should handle the case when the genre to delete is not found', async () => {
      jest.spyOn(Genre, 'findByIdAndDelete').mockResolvedValue(null);

      const response = await request.delete('/genres/123');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'cannot find any genre with ID 123' });
    });

    it('should handle errors and return a 500 status with an error message', async () => {
      jest.spyOn(Genre, 'findByIdAndDelete').mockRejectedValue(new Error('Mongoose error'));

      const response = await request.delete('/genres/123');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Mongoose error' });
    });
  });
});
