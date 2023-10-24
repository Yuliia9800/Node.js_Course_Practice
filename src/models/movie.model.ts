import { Schema, model } from 'mongoose';

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

export const Movie = model('Movie', movieSchema);
