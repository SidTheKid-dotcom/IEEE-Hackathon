import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface IncreaseXPResponse {
  message: string;
  user: any;
  updatedUser: any;
}

interface IncreaseActivityResponse {
  message: string;
}

export async function increaseXP(userID: number, xp: number): Promise<IncreaseXPResponse> {
  // Fetch the current XP and Level
  const user = await prisma.user.findUnique({
    where: { id: userID },
    select: { buddyPokemonXP: true, buddyPokemonLevel: true, buddyPokemon: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Calculate new XP and Level
  const newXP = (user.buddyPokemonXP ?? 0) + xp;
  let incrementLevel = 0;
  let newBuddyPokemonId = user.buddyPokemon;

  if (newXP >= 100) {
    incrementLevel = 1;
    // Check if the level is 5 or 10 to increment the buddyPokemon ID
    const newLevel = (user.buddyPokemonLevel ?? 0) + incrementLevel;
    if (newLevel === 6 || newLevel === 10) {
      newBuddyPokemonId = (user.buddyPokemon ?? 0) + 1;
    }
  }

  // Update XP, Level, and Buddy Pokemon ID
  const updatedUser = await prisma.user.update({
    where: { id: userID },
    data: {
      buddyPokemonXP: newXP >= 100 ? 0 : newXP,
      buddyPokemonLevel: { increment: incrementLevel },
      buddyPokemon: newBuddyPokemonId !== user.buddyPokemon ? newBuddyPokemonId : undefined,
    },
  });

  return { message: 'XP increased successfully', user, updatedUser };
}

export async function increaseActivity(userID: number, pokemonId: number, increment: number): Promise<IncreaseActivityResponse> {
  // Fetch the current XP and Level

  const pokemon = await prisma.activity.findFirst({
    where: { user_id: userID, pokemonId: pokemonId },
  });

  if (!pokemon) {
    await prisma.activity.create({
      data: {
        user_id: userID,
        pokemonId: pokemonId,
        activity: increment,
      },
    })

    return { message: 'Activity increased successfully' };
  }

  // Calculate new activity 
  const newActivity = pokemon.activity + increment;

    const newPokemon = await prisma.activity.update({
      where: { id: pokemon.id, pokemonId: pokemonId },
      data: {
        activity: newActivity,
      },
    })

  return { message: 'XP increased successfully' };
}
