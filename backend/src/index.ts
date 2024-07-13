import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.get('/', async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.json(users);
  });
  

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
