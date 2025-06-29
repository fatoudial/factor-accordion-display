
import express from 'express';
import cors from 'cors';
import { router as messagesRouter } from './routes/messages';
import { router as booksRouter } from './routes/books';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/messages', messagesRouter);
app.use('/api/books', booksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
