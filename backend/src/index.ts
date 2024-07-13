import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.get('/', async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.post('/create', async (req: Request, res: Response) => {
    const newUser = await prisma.user.create({
        data: {
            email: 'test1@example.com',
            password: 'securepassword1',
        },
    });
    console.log('Created user:', newUser);

    // Add a favorite for the user
    const newFavorite = await prisma.favorite.create({
        data: {
            pokemon_id: 30, // Pikachu as an example
            pokemon_name: 'Caterpie',
            user_id: newUser.user_id,
        },
    });
    console.log('Added favorite:', newFavorite);

    // Query user with their favorites
    const userWithFavorites = await prisma.user.findUnique({
        where: { user_id: newUser.user_id },
        include: { favorites: true },
    });
    console.log('User with favorites:', userWithFavorites);
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
