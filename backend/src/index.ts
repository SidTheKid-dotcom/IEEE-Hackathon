import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import authMiddleware from './authMiddleware';

// Load environment variables from .env file
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

interface AuthRequest extends Request {
    userID?: number;
}

// Middleware to parse JSON request bodies
app.use(express.json());

// Route: Get all users
app.get('/', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: (error as Error).message });
    }
});

// Route: Sign up
app.post('/signup', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                buddy_pokemon: 0,
            },
        });

        const isLuckyUserID = String(user.id).split('').every(char => char === '7');
        const starterPokemonIds: number[] = process.env.STARTER_POKEMON_IDS?.split(',').map(Number) || [];

        const buddyPokemon = isLuckyUserID ? 25 : (starterPokemonIds.length > 0
            ? starterPokemonIds[Math.floor(Math.random() * starterPokemonIds.length)]
            : 0);

        await prisma.user.update({
            where: { id: user.id },
            data: { buddy_pokemon: buddyPokemon },
        });

        const token = jwt.sign({ userID: user.id }, JWT_SECRET_KEY);

        return res.status(201).json({ message: 'User created', token });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error: (error as Error).message });
    }
});

// Route: Sign in
app.post('/signin', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ userID: user.id }, JWT_SECRET_KEY);

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error signing in', error: (error as Error).message });
    }
});

// Route: Get user info
app.get('/user', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userID as number } });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: (error as Error).message });
    }
});

// Route: Get user info for a pokemon
app.get('/getInfo/:pokemonId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { pokemonId } = req.params;
        const parsedPokemonId = parseInt(pokemonId, 10);

        if (isNaN(parsedPokemonId)) {
            return res.status(400).json({ message: 'Invalid Pokemon ID' });
        }

        const userInfo = await prisma.user.findUnique({
            where: { id: req.userID as number },
            include: {
                ratings: { where: { pokemon_id: parsedPokemonId } },
                comments: { where: { pokemon_id: parsedPokemonId } },
                favorites: { where: { pokemon_id: parsedPokemonId } },
            },
        });

        if (!userInfo) {
            return res.status(404).json({ message: 'User not found' });
        }

        const rating = userInfo.ratings[0]?.rating || null;
        const comment = userInfo.comments[0]?.comment || null;
        const isFavorite = userInfo.favorites.length > 0;

        res.status(200).json({ rating, comment, isFavorite });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving state info', error: (error as Error).message });
    }
});

// Route: Add favorite pokemon
app.post('/addFavouritePokemon', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { pokemon_id, pokemon_name } = req.body;

        const newFavorite = await prisma.favorite.create({
            data: {
                pokemon_id: pokemon_id as number,
                pokemon_name: pokemon_name as string,
                user_id: req.userID as number,
            },
        });

        res.status(201).json({ message: "New Favorite Added", newFavorite });
    } catch (error) {
        res.status(500).json({ message: 'Error creating favorite', error: (error as Error).message });
    }
});

// Route: Remove favorite pokemon
app.delete('/removeFavouritePokemon', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { pokemon_id } = req.body;

        await prisma.favorite.deleteMany({
            where: {
                pokemon_id: pokemon_id as number,
                user_id: req.userID as number,
            },
        });

        res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error removing favorite', error: (error as Error).message });
    }
});

// Route: Get favorites
app.get('/getFavourites', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const favorites = await prisma.favorite.findMany({ where: { user_id: req.userID as number } });
        res.status(200).json({ favorites });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving favorites', error: (error as Error).message });
    }
});

// Route: Rate a Pokemon
app.post('/ratePokemon', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { pokemon_id, rating } = req.body;

        const newRating = await prisma.rating.create({
            data: {
                pokemon_id: pokemon_id as number,
                rating: rating as number,
                user_id: req.userID as number,
            },
        });

        res.status(201).json({ message: "Pokemon rated successfully", newRating });
    } catch (error) {
        res.status(500).json({ message: 'Error creating rating', error: (error as Error).message });
    }
});

// Route: Update rating for a Pokemon
app.put('/updateRating/:ratingId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { ratingId } = req.params;
        const { rating } = req.body;

        const updatedRating = await prisma.rating.updateMany({
            where: {
                id: parseInt(ratingId, 10),
                user_id: req.userID as number,
            },
            data: {
                rating: parseInt(rating, 10),
            },
        });

        res.status(200).json({ message: "Rating updated successfully", updatedRating });
    } catch (error) {
        res.status(500).json({ message: 'Error updating rating', error: (error as Error).message });
    }
});

// Route: Delete rating for a Pokemon
app.delete('/deleteRating/:ratingId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { ratingId } = req.params;

        await prisma.rating.deleteMany({
            where: {
                id: parseInt(ratingId, 10),
                user_id: req.userID as number,
            },
        });

        res.status(200).json({ message: "Rating deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting rating', error: (error as Error).message });
    }
});

// Route: Comment on a Pokemon
app.post('/commentPokemon', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { pokemon_id, comment } = req.body;

        const newComment = await prisma.comment.create({
            data: {
                pokemon_id: pokemon_id as number,
                comment: comment as string,
                user_id: req.userID as number,
            },
        });

        res.status(201).json({ message: "Commented on Pokemon successfully", newComment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment', error: (error as Error).message });
    }
});

// Route: Update comment for a Pokemon
app.put('/updateComment/:commentId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;

        const updatedComment = await prisma.comment.updateMany({
            where: {
                id: parseInt(commentId, 10),
                user_id: req.userID as number,
            },
            data: {
                comment: comment as string,
            },
        });

        res.status(200).json({ message: "Comment updated successfully", updatedComment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error: (error as Error).message });
    }
});

// Route: Delete comment for a Pokemon
app.delete('/deleteComment/:commentId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { commentId } = req.params;

        await prisma.comment.deleteMany({
            where: {
                id: parseInt(commentId, 10),
                user_id: req.userID as number,
            },
        });

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: (error as Error).message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
