import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import authMiddleware from './authMiddleware';
import cors from 'cors';
import bodyParser from 'body-parser';
import { increaseXP } from './commonFunctions';


// Load environment variables from .env file
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3010;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

interface AuthRequest extends Request {
    userID?: number;
}

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json({ limit: '10mb' }));

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
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        /* const isLuckyUserID = String(user.id).split('').every(char => char === '7');
        const starterPokemonIds: number[] = process.env.STARTER_POKEMON_IDS?.split(',').map(Number) || [];

        const buddyPokemon = isLuckyUserID ? 25 : (starterPokemonIds.length > 0
            ? starterPokemonIds[Math.floor(Math.random() * starterPokemonIds.length)]
            : 0);

        await prisma.user.update({
            where: { id: user.id },
            data: { buddy_pokemon: buddyPokemon },
        }); */

        const token = jwt.sign({ userID: user.id, username: user.username }, JWT_SECRET_KEY);

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

        console.log(user);

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log(isPasswordValid);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ userID: user.id, username: user.username }, JWT_SECRET_KEY);

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

        // Increase XP after adding a favorite Pokémon
        const xpResponse = await increaseXP(req.userID as number, 10);

        res.status(201).json({ message: "New Favorite Added", newFavorite, xpResponse });
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

        // increase xp
        const xpResponse = await increaseXP(req.userID as number, 30);

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

        // increase xp
        const xpResponse = await increaseXP(req.userID as number, 10);

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

        // increase xp
        const xpResponse = await increaseXP(req.userID as number, 20);

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

        // increase xp
        const xpResponse = await increaseXP(req.userID as number, 10);

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

import multer from "multer";
import path from "path";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

// Initialize GoogleGenerativeAI with your API_KEY.
const genAI = new GoogleGenerativeAI("AIzaSyBPDAulhDgCKGr8ugym1dz9mByBk7QWBHo");

const model: GenerativeModel = genAI.getGenerativeModel({
    // Choose a Gemini model.
    model: "gemini-1.5-flash",
});

// Initialize GoogleAIFileManager with your API_KEY.
const fileManager = new GoogleAIFileManager(
    "AIzaSyBPDAulhDgCKGr8ugym1dz9mByBk7QWBHo"
);

// Configure storage for Multer
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, path.join(__dirname, 'uploads/')); // Adjust path to your uploads directory
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file original name
    },
});

// Initialize upload variable with storage configuration
const upload = multer({ storage: storage });

// Create an endpoint for file upload
app.post("/upload", upload.single("file"), async (req: AuthRequest, res: Response) => {

    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    const filePath = req.file.path;
    const fileOptions = {
        mimeType: req.file.mimetype,
        displayName: req.file.originalname,
    };

    try {
        const uploadResponse = await fileManager.uploadFile(filePath, fileOptions);

        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri,
                },
            },
            { text: "Guess the pokemon id only, just give me the id and nothing else should be in the response" },
        ]);

        const pokemonId = result.response.text();
        console.log(result.response.text());

        res.json({
            message: `File uploaded successfully: ${req.file.filename}`,
            pokemonId: pokemonId
        })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred during file upload");
    }
});

// find your pokemon route
app.post("/findYourPokemon", authMiddleware, async (req: AuthRequest, res: Response) => {
    const { counts } = req.body;
    const random = Math.floor(Math.random() * 2);

    const indexOfMaxValue = counts.reduce((iMax: number, x: number, i: number, counts: number[]) => x > counts[iMax] ? i : iMax, 0);

    let chosenPokemonId;

    try {
        if (indexOfMaxValue === 0) {
            if (random === 0) {
                chosenPokemonId = 1; // Bulbasaur
            } else {
                chosenPokemonId = 152; // Chikorita
            }
        } else if (indexOfMaxValue === 1) {
            if (random === 0) {
                chosenPokemonId = 4; // Charmander
            } else {
                chosenPokemonId = 155; // Cyndaquil
            }
        } else {
            if (random === 0) {
                chosenPokemonId = 7; // Squirtle
            } else {
                chosenPokemonId = 158; // Totodile
            }
        }

        await prisma.user.update({
            where: { id: req.userID as number },
            data: {
                buddyPokemon: chosenPokemonId as number,
                buddyPokemonLevel: 5 as number,
                buddyPokemonXP: 30 as number
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error choosing your Pokémon' });
    }

    return res.status(200).json({
        message: "Pokémon Chosen Successfully",
        pokemonId: chosenPokemonId,
    });
});

// get route to get the chosen pokemon
app.get('/getChosenPokemon', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userID as number } });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.status(200).json({
            pokemon: user.buddyPokemon,
            level: user.buddyPokemonLevel,
            xp: user.buddyPokemonXP
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error getting chosen pokemon' });
    }
})

// route to increase xp
app.post('/increaseXP', authMiddleware, async (req: AuthRequest, res: Response) => {
    const { xp } = req.body;

    try {
        const xpResponse = await increaseXP(req.userID as number, xp);
        res.status(200).json(xpResponse);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error increasing XP', error: (error as Error).message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
