import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import connectDB, { disconnectDB } from '../db/connectDB.js';

dotenv.config();

// Sample users data
const sampleUsers = [
  {
    name: 'Sarah Chen',
    username: 'sarahcooks',
    email: 'sarah@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'Food enthusiast | Home cook | Sharing my culinary adventures'
  },
  {
    name: 'Marco Rossi',
    username: 'marcoitalian',
    email: 'marco@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Italian chef | Pasta lover | Traditional recipes with a twist'
  },
  {
    name: 'Priya Sharma',
    username: 'priyaspices',
    email: 'priya@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    bio: 'Indian cuisine expert | Spice queen | Vegetarian recipes'
  },
  {
    name: 'James Wilson',
    username: 'jamesgrills',
    email: 'james@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    bio: 'BBQ master | Grill enthusiast | Meat lover'
  },
  {
    name: 'Yuki Tanaka',
    username: 'yukisushi',
    email: 'yuki@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    bio: 'Japanese cuisine | Sushi artist | Zen cooking'
  }
];

// Sample recipes data
const sampleRecipes = [
  {
    title: 'Creamy Mushroom Risotto',
    description: 'A rich and creamy Italian classic made with arborio rice, fresh mushrooms, and parmesan cheese. Perfect for a cozy dinner.',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop',
    cuisine: 'Italian',
    prepTime: 45,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Arborio rice', amount: '1.5', unit: 'cups' },
      { name: 'Mushrooms', amount: '300', unit: 'g' },
      { name: 'Vegetable broth', amount: '4', unit: 'cups' },
      { name: 'Parmesan cheese', amount: '0.5', unit: 'cup' },
      { name: 'White wine', amount: '0.5', unit: 'cup' },
      { name: 'Onion', amount: '1', unit: 'medium' },
      { name: 'Garlic', amount: '3', unit: 'cloves' },
      { name: 'Butter', amount: '3', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Prepare the broth', detail: 'Heat the vegetable broth in a saucepan over medium heat until it reaches a gentle simmer. Keep it warm on low heat throughout the cooking process.' },
      { step: 2, title: 'Sauté the mushrooms', detail: 'In a large pot, melt 2 tablespoons of butter over medium-high heat. Add sliced mushrooms and cook for 5-7 minutes until golden brown.' },
      { step: 3, title: 'Cook the aromatics', detail: 'Add remaining butter, finely chopped onion and minced garlic. Sauté for 3-4 minutes until onion becomes translucent.' },
      { step: 4, title: 'Toast the rice', detail: 'Add arborio rice and stir constantly for 2 minutes until grains become slightly translucent around the edges.' },
      { step: 5, title: 'Deglaze with wine', detail: 'Pour in white wine and stir continuously until completely absorbed by the rice.' },
      { step: 6, title: 'Add broth gradually', detail: 'Add warm broth one ladle at a time. Stir constantly and wait until each addition is almost completely absorbed.' },
      { step: 7, title: 'Finish with mushrooms and cheese', detail: 'When rice is al dente, stir in sautéed mushrooms and grated parmesan cheese. Let rest for 2 minutes.' }
    ],
    alternativeIngredients: ['Coconut milk for creaminess', 'Nutritional yeast for vegan option'],
    tags: ['italian', 'vegetarian', 'dinner', 'comfort food']
  },
  {
    title: 'Classic Margherita Pizza',
    description: 'The ultimate Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop',
    cuisine: 'Italian',
    prepTime: 90,
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Pizza dough', amount: '1', unit: 'ball' },
      { name: 'San Marzano tomatoes', amount: '200', unit: 'g' },
      { name: 'Fresh mozzarella', amount: '150', unit: 'g' },
      { name: 'Fresh basil', amount: '10', unit: 'leaves' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' },
      { name: 'Salt', amount: '1', unit: 'tsp' }
    ],
    instructions: [
      { step: 1, title: 'Preheat the oven', detail: 'Place a pizza stone in the oven and preheat to the highest setting (500-550°F). Let it heat for at least 45 minutes.' },
      { step: 2, title: 'Prepare the sauce', detail: 'Drain tomatoes and crush by hand. Add a pinch of salt. The sauce should be chunky, not smooth.' },
      { step: 3, title: 'Prepare the cheese', detail: 'Tear fresh mozzarella into small pieces. Let drain on paper towels for 10 minutes.' },
      { step: 4, title: 'Stretch the dough', detail: 'Gently press dough from center outward into a 10-12 inch round. Do not use a rolling pin.' },
      { step: 5, title: 'Add toppings', detail: 'Spread crushed tomatoes, distribute mozzarella, and drizzle with olive oil.' },
      { step: 6, title: 'Bake the pizza', detail: 'Bake for 10-12 minutes until crust is puffed and cheese is bubbling.' },
      { step: 7, title: 'Finish with fresh basil', detail: 'Top with fresh basil leaves immediately after removing from oven.' }
    ],
    alternativeIngredients: ['Gluten-free dough', 'Vegan mozzarella'],
    tags: ['italian', 'pizza', 'vegetarian', 'classic']
  },
  {
    title: 'Butter Chicken (Murgh Makhani)',
    description: 'Creamy, aromatic, and absolutely delicious Indian curry. Tender chicken in a rich tomato-based sauce with warm spices.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop',
    cuisine: 'Indian',
    prepTime: 60,
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken thighs', amount: '800', unit: 'g' },
      { name: 'Yogurt', amount: '1', unit: 'cup' },
      { name: 'Tomato puree', amount: '400', unit: 'g' },
      { name: 'Heavy cream', amount: '0.5', unit: 'cup' },
      { name: 'Butter', amount: '4', unit: 'tbsp' },
      { name: 'Garam masala', amount: '2', unit: 'tsp' },
      { name: 'Turmeric', amount: '1', unit: 'tsp' },
      { name: 'Cumin', amount: '1', unit: 'tsp' },
      { name: 'Coriander', amount: '1', unit: 'tsp' },
      { name: 'Ginger-garlic paste', amount: '2', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Marinate the chicken', detail: 'Cut chicken into pieces. Combine with yogurt, garam masala, turmeric, and salt. Refrigerate for 30 minutes.' },
      { step: 2, title: 'Cook the chicken', detail: 'Grill or pan-fry marinated chicken until charred and cooked through. Set aside.' },
      { step: 3, title: 'Prepare the sauce base', detail: 'Melt butter, add ginger-garlic paste and spices. Toast for 30 seconds.' },
      { step: 4, title: 'Build the sauce', detail: 'Add tomato puree and simmer for 15-20 minutes until thickened.' },
      { step: 5, title: 'Add cream and chicken', detail: 'Stir in heavy cream and cooked chicken. Simmer gently for 10 minutes.' },
      { step: 6, title: 'Finish and serve', detail: 'Garnish with fresh cilantro and serve with naan or rice.' }
    ],
    alternativeIngredients: ['Coconut cream instead of heavy cream', 'Tofu for vegetarian version'],
    tags: ['indian', 'curry', 'chicken', 'dinner']
  },
  {
    title: 'Fresh Salmon Sashimi Bowl',
    description: 'A beautiful chirashi bowl with premium salmon sashimi, seasoned sushi rice, and fresh vegetables.',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 30,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Sushi-grade salmon', amount: '300', unit: 'g' },
      { name: 'Sushi rice', amount: '2', unit: 'cups' },
      { name: 'Rice vinegar', amount: '3', unit: 'tbsp' },
      { name: 'Cucumber', amount: '1', unit: 'medium' },
      { name: 'Avocado', amount: '1', unit: 'ripe' },
      { name: 'Edamame', amount: '0.5', unit: 'cup' },
      { name: 'Pickled ginger', amount: '2', unit: 'tbsp' },
      { name: 'Soy sauce', amount: '2', unit: 'tbsp' },
      { name: 'Wasabi', amount: '1', unit: 'tsp' },
      { name: 'Sesame seeds', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Cook the sushi rice', detail: 'Rinse rice until water runs clear. Cook and fold in seasoned rice vinegar while fanning.' },
      { step: 2, title: 'Prepare the salmon', detail: 'Using a sharp knife, slice salmon against the grain into 1/4-inch thick pieces.' },
      { step: 3, title: 'Prepare vegetables', detail: 'Slice cucumber and avocado. Cook edamame according to package directions.' },
      { step: 4, title: 'Assemble the bowl', detail: 'Place seasoned sushi rice in bowl. Arrange salmon and vegetables artfully.' },
      { step: 5, title: 'Add garnishes', detail: 'Top with pickled ginger, sesame seeds, and wasabi.' },
      { step: 6, title: 'Serve immediately', detail: 'Serve with soy sauce for dipping.' }
    ],
    alternativeIngredients: ['Tuna or yellowtail instead of salmon', 'Quinoa instead of rice'],
    tags: ['japanese', 'sushi', 'healthy', 'seafood']
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Recipe.deleteMany({});

    // Create users
    console.log('Creating sample users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create recipes
    console.log('Creating sample recipes...');
    for (let i = 0; i < sampleRecipes.length; i++) {
      const recipeData = sampleRecipes[i];
      const user = createdUsers[i % createdUsers.length];
      
      const recipe = await Recipe.create({
        ...recipeData,
        user: user._id
      });
      
      console.log(`Created recipe: ${recipe.title} by ${user.username}`);
    }

    // Add some interactions (likes, follows)
    console.log('Adding sample interactions...');
    
    // Make users follow each other
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const usersToFollow = createdUsers.filter((_, idx) => idx !== i).slice(0, 2);
      
      for (const userToFollow of usersToFollow) {
        await User.findByIdAndUpdate(user._id, {
          $addToSet: { following: userToFollow._id }
        });
        await User.findByIdAndUpdate(userToFollow._id, {
          $addToSet: { followers: user._id }
        });
      }
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Sample Login Credentials:');
    console.log('----------------------------------------');
    sampleUsers.forEach(user => {
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('----------------------------------------');
    });

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
