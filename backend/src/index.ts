import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const authMiddleware = require('./authMiddleware').default;

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
        res.status(500).json({ message: 'Error retrieving users' });
    }
});

// Route: Sign up
app.post('/signup', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                buddy_pokemon: 0,
            },
        });

        // Check if the userID contains only the digit 7
        let userID = user.id;
        let flag = true;
        while (userID > 0) {
            const dig = userID % 10;
            if (dig !== 7) {
                flag = false;
                break;
            }
            userID = Math.floor(userID / 10);
        }

        const starterPokemonIds: number[] = process.env.STARTER_POKEMON_IDS?.split(',').map(Number) ?? [];

        let buddyPokemon: number;
        if (flag) {
            buddyPokemon = 25;
        } else {
            buddyPokemon = starterPokemonIds.length > 0
                ? starterPokemonIds[Math.floor(Math.random() * starterPokemonIds.length)]
                : 0;
        }

        // Update the user with the selected buddyPokemon
        await prisma.user.update({
            where: { id: user.id },
            data: { buddy_pokemon: buddyPokemon }
        });

        const token = jwt.sign({ userID: user.id }, JWT_SECRET_KEY);

        return res.status(201).json({ message: 'User created', token: token });
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

        res.status(200).json({
            message: 'Login successful',
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error signing in', error: (error as Error).message });
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
        console.log('Added favorite:', newFavorite);

        res.status(201).json({
            message: "New Favorite Added",
            newFavorite: newFavorite
        });

    } catch (error) {
        res.status(500).json({ message: 'Error creating favorite', error: (error as Error).message });
    }

});

app.post('/ratePokemon', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { pokemon_id, rating } = req.body;

        const newRating = await prisma.rating.create({
            data: {
                pokemon_id: pokemon_id as number, // Cast pokemon_id to number
                rating: rating as number, // Cast rating to number
                user_id: req.userID as number, // Use req.user for userID
            },
        });
        console.log('Added rating:', newRating);

        return res.status(201).json({
            message: "Pokemon rated successfully",
            newRating: newRating
        })
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating rating', error: (error as Error).message });
    }
})

// Update rating for a Pokemon
app.put('/updateRating/:ratingId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { ratingId } = req.params;
        const { pokemon_id, rating } = req.body;

        const updatedRating = await prisma.rating.update({
            where: {
                id: parseInt(ratingId),
                pokemon_id: parseInt(pokemon_id),
                user_id: req.userID as number,
            },
            data: {
                rating: parseInt(rating),
            },
        });

        return res.status(200).json({
            message: "Rating updated successfully",
            updatedRating: updatedRating
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating rating', error: (error as Error).message });
    }
});

// Delete rating for a Pokemon
app.delete('/deleteRating/:ratingId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { ratingId } = req.params;

        await prisma.rating.delete({
            where: {
                id: parseInt(ratingId),
                user_id: req.userID as number,
            },
        });

        return res.status(200).json({
            message: "Rating deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting rating', error: (error as Error).message });
    }
});

app.post('/commentPokemon', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { pokemon_id, comment } = req.body;

        const newComment = await prisma.comment.create({
            data: {
                pokemon_id: pokemon_id as number, // Cast pokemon_id to number
                comment: comment as string, // Cast rating to number
                user_id: req.userID as number, // Use req.user for userID
            },
        });
        console.log('Added comment:', newComment);

        return res.status(201).json({
            message: "Commented on Pokemon successfully",
            newComment: newComment
        })
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating rating', error: (error as Error).message });
    }
})

// Update comment for a Pokemon
app.put('/updateComment/:commentId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { commentId } = req.params;
        const { pokemon_id, comment } = req.body;

        const updatedComment = await prisma.comment.update({
            where: {
                id: parseInt(commentId),
                pokemon_id: parseInt(pokemon_id), // Convert pokemon_id to number
                user_id: req.userID as number, // Use req.user for userID
            },
            data: {
                comment: comment as string,
            },
        });

        return res.status(200).json({
            message: "Comment updated successfully",
            updatedComment: updatedComment
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error: (error as Error).message });
    }
});

// Delete comment for a Pokemon
app.delete('/deleteComment/:commentId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { commentId } = req.params;

        await prisma.comment.delete({
            where: {
                id: parseInt(commentId),
                user_id: req.userID as number
            },
        });

        return res.status(200).json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: (error as Error).message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
