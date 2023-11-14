import supertest from 'supertest';
import { Movie } from '../models/movie.model';
import { app } from '../app';

const request = supertest(app);

describe('[Movies] API', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /', () => {
    it('should return list of movies', async () => {
      jest.spyOn(Movie, 'find').mockResolvedValue([]);

      const response = await request.get('/movies');

      expect(response.status).toBe(200);
    });
  });

  describe('POST /', () => {
    const movie = { title: 'movie1', description: 'funny', releaseDate: '10-10-2023', genre: ['comedy'] };

    it('should return status 400 and validation errors', async () => {
      const response = await request.post('/movies').send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(6);
    });

    it('should return status 404 if movie already exist', async () => {
      jest.spyOn(Movie, 'findOne').mockResolvedValue(true);
      const response = await request.post('/movies').send(movie);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('That movie already exist');
    });

    it('should return status 200', async () => {
      jest.spyOn(Movie, 'findOne').mockResolvedValue(false);
      jest.spyOn(Movie, 'create').mockReturnValue(movie as any);
      const response = await request.post('/movies').send(movie);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(movie);
    });

    it('should return status 500', async () => {
      jest.spyOn(Movie, 'findOne').mockResolvedValue(false);
      jest.spyOn(Movie, 'create').mockRejectedValue(new Error('Mongoose error'));
      const response = await request.post('/movies').send(movie);

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /:id', () => {
    const movie = { title: 'movie1', description: 'funny', releaseDate: '10-10-2023', genre: ['comedy'] };

    it('should return movie and update', async () => {
      jest.spyOn(Movie, 'findByIdAndUpdate').mockResolvedValue(true);
      jest.spyOn(Movie, 'findById').mockResolvedValue(movie);
      const response = await request.put('/movies/123').send(movie);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(movie);
    });

    it('should return 404 if movie does not exist', async () => {
      jest.spyOn(Movie, 'findByIdAndUpdate').mockResolvedValue(false);
      const response = await request.put('/movies/123').send(movie);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('cannot find any movie with ID 123');
    });

    it('should return 500', async () => {
      jest.spyOn(Movie, 'findByIdAndUpdate').mockRejectedValue(new Error('Mongoose error'));
      const response = await request.put('/movies/123').send(movie);

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a movie and return a success message', async () => {
      jest.spyOn(Movie, 'findByIdAndDelete').mockResolvedValue(true);

      const response = await request.delete('/movies/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'movie has been deleted' });
    });

    it('should handle the case when the movie to delete is not found', async () => {
      jest.spyOn(Movie, 'findByIdAndDelete').mockResolvedValue(null);

      const response = await request.delete('/movies/123');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'cannot find any movie with ID 123' });
    });

    it('should handle errors and return a 500 status with an error message', async () => {
      jest.spyOn(Movie, 'findByIdAndDelete').mockRejectedValue(new Error('Mongoose error'));

      const response = await request.delete('/movies/123');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Mongoose error' });
    });
  });

  describe('GET /genre/:genreName', () => {
    it('should return list of movies by genre', async () => {
      jest.spyOn(Movie, 'find').mockResolvedValue([]);

      const response = await request.get('/movies/genre/comedy');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should handle errors and return a 500 status with an error message', async () => {
      jest.spyOn(Movie, 'find').mockRejectedValue(new Error('Mongoose error'));

      const response = await request.get('/movies/genre/comedy');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Mongoose error' });
    });
  });
});
