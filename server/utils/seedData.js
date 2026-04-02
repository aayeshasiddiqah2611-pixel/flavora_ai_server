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
  },
  {
    title: 'Spaghetti Carbonara',
    description: 'Classic Roman pasta with eggs, Pecorino Romano, guanciale, and black pepper. No cream needed!',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop',
    cuisine: 'Italian',
    prepTime: 25,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Spaghetti', amount: '400', unit: 'g' },
      { name: 'Guanciale', amount: '150', unit: 'g' },
      { name: 'Egg yolks', amount: '4', unit: 'large' },
      { name: 'Pecorino Romano', amount: '1', unit: 'cup' },
      { name: 'Black pepper', amount: '2', unit: 'tsp' },
      { name: 'Salt', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Cook the pasta', detail: 'Bring a large pot of salted water to boil. Cook spaghetti until al dente, about 8-10 minutes. Reserve 1 cup of pasta water before draining.' },
      { step: 2, title: 'Crisp the guanciale', detail: 'Cut guanciale into small cubes. Cook in a large skillet over medium heat until crispy and fat has rendered, about 7-8 minutes. Remove from heat.' },
      { step: 3, title: 'Prepare the sauce', detail: 'In a bowl, whisk egg yolks with grated Pecorino Romano and plenty of freshly cracked black pepper. The mixture should be thick and paste-like.' },
      { step: 4, title: 'Combine pasta and guanciale', detail: 'Add hot drained pasta to the skillet with guanciale. Toss quickly to coat with rendered fat. The pasta must be hot for the next step.' },
      { step: 5, title: 'Add the sauce', detail: 'Working quickly, add the egg mixture to the pasta. Toss constantly, adding reserved pasta water a little at a time to create a creamy sauce. The residual heat cooks the eggs without scrambling them.' },
      { step: 6, title: 'Serve immediately', detail: 'Divide among warm plates. Top with extra Pecorino and more black pepper. Serve immediately while hot and creamy.' }
    ],
    alternativeIngredients: ['Pancetta instead of guanciale', 'Parmesan instead of Pecorino'],
    tags: ['italian', 'pasta', 'classic', 'comfort food']
  },
  {
    title: 'Chicken Tikka Masala',
    description: 'Grilled chicken chunks in a creamy spiced tomato sauce - a British-Indian favorite.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop',
    cuisine: 'Indian',
    prepTime: 60,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken breast', amount: '600', unit: 'g' },
      { name: 'Yogurt', amount: '1', unit: 'cup' },
      { name: 'Tomato puree', amount: '400', unit: 'g' },
      { name: 'Heavy cream', amount: '0.5', unit: 'cup' },
      { name: 'Garam masala', amount: '2', unit: 'tbsp' },
      { name: 'Ginger-garlic paste', amount: '2', unit: 'tbsp' },
      { name: 'Kasuri methi', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Marinate chicken', detail: 'Cut chicken into chunks. Marinate in yogurt with spices for at least 30 minutes.' },
      { step: 2, title: 'Grill tikka', detail: 'Thread chicken on skewers. Grill or broil until charred and cooked through, about 12 minutes.' },
      { step: 3, title: 'Make sauce', detail: 'Sauté onions, add ginger-garlic paste, tomato puree, and spices. Simmer 15 minutes.' },
      { step: 4, title: 'Finish', detail: 'Add cream and grilled chicken. Crush kasuri methi between palms and add. Simmer 5 minutes.' }
    ],
    alternativeIngredients: ['Paneer instead of chicken', 'Coconut milk instead of cream'],
    tags: ['indian', 'curry', 'chicken', 'dinner']
  },
  {
    title: 'BBQ Ribs with Homemade Sauce',
    description: 'Fall-off-the-bone tender ribs slathered in a sweet and smoky barbecue sauce.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
    cuisine: 'American',
    prepTime: 180,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Pork ribs', amount: '2', unit: 'racks' },
      { name: 'Brown sugar', amount: '0.25', unit: 'cup' },
      { name: 'Paprika', amount: '2', unit: 'tbsp' },
      { name: 'Garlic powder', amount: '1', unit: 'tbsp' },
      { name: 'BBQ sauce', amount: '1', unit: 'cup' },
      { name: 'Apple cider vinegar', amount: '0.25', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Remove the membrane', detail: 'Flip the ribs bone-side up. Pull off the thin membrane covering the bones.' },
      { step: 2, title: 'Apply dry rub', detail: 'Mix brown sugar, paprika, garlic powder, and cayenne. Rub all over ribs. Refrigerate overnight.' },
      { step: 3, title: 'Slow cook', detail: 'Cook at 225°F for 3 hours. Wrap in foil, cook 2 more hours.' },
      { step: 4, title: 'Glaze and finish', detail: 'Unwrap, brush with BBQ sauce. Cook 1 more hour until sticky and caramelized.' }
    ],
    alternativeIngredients: ['Beef ribs instead of pork', 'Sugar-free rub for keto'],
    tags: ['american', 'bbq', 'pork', 'grilling']
  },
  {
    title: 'Thai Green Curry',
    description: 'A fragrant and spicy Thai curry with coconut milk, fresh vegetables, and your choice of protein.',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop',
    cuisine: 'Thai',
    prepTime: 40,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Green curry paste', amount: '3', unit: 'tbsp' },
      { name: 'Coconut milk', amount: '2', unit: 'cans' },
      { name: 'Chicken breast', amount: '400', unit: 'g' },
      { name: 'Thai eggplant', amount: '4', unit: 'small' },
      { name: 'Fish sauce', amount: '2', unit: 'tbsp' },
      { name: 'Palm sugar', amount: '1', unit: 'tbsp' },
      { name: 'Thai basil', amount: '1', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Fry curry paste', detail: 'Fry green curry paste in thick coconut cream until fragrant, about 2-3 minutes.' },
      { step: 2, title: 'Cook the protein', detail: 'Add chicken and stir-fry for 3-4 minutes until sealed on all sides.' },
      { step: 3, title: 'Add coconut milk', detail: 'Pour in remaining coconut milk and bring to a gentle simmer.' },
      { step: 4, title: 'Add vegetables', detail: 'Add eggplant and season with fish sauce and palm sugar. Simmer 10-15 minutes.' },
      { step: 5, title: 'Finish', detail: 'Turn off heat. Stir in Thai basil. Serve with jasmine rice.' }
    ],
    alternativeIngredients: ['Firm tofu for vegetarian', 'Red curry paste for different flavor'],
    tags: ['thai', 'curry', 'coconut', 'spicy']
  },
  {
    title: 'Authentic Tacos Al Pastor',
    description: 'Mexican street food classic with marinated pork, pineapple, and fresh cilantro on warm corn tortillas.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=600&fit=crop',
    cuisine: 'Mexican',
    prepTime: 120,
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Pork shoulder', amount: '1', unit: 'kg' },
      { name: 'Pineapple', amount: '0.5', unit: 'whole' },
      { name: 'Corn tortillas', amount: '12', unit: 'pieces' },
      { name: 'Achiote paste', amount: '3', unit: 'tbsp' },
      { name: 'Guajillo chiles', amount: '4', unit: 'dried' },
      { name: 'Cilantro', amount: '1', unit: 'bunch' },
      { name: 'Lime', amount: '3', unit: 'pieces' }
    ],
    instructions: [
      { step: 1, title: 'Prepare the marinade', detail: 'Toast guajillo chiles. Blend with achiote paste, vinegar, garlic, and pineapple juice.' },
      { step: 2, title: 'Marinate the pork', detail: 'Slice pork thin. Coat with marinade. Refrigerate 2 hours or overnight.' },
      { step: 3, title: 'Cook the meat', detail: 'Grill pork over medium-high heat until charred, 4-5 minutes per side.' },
      { step: 4, title: 'Assemble tacos', detail: 'Place pork on warm tortillas. Top with pineapple, onion, cilantro, and lime.' }
    ],
    alternativeIngredients: ['Chicken thighs instead of pork', 'Flour tortillas instead of corn'],
    tags: ['mexican', 'tacos', 'street food', 'pork']
  },
  {
    title: 'Vegetable Biryani',
    description: 'Fragrant basmati rice layered with spiced vegetables, saffron, and fried onions.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop',
    cuisine: 'Indian',
    prepTime: 75,
    servings: 6,
    difficulty: 'Hard',
    ingredients: [
      { name: 'Basmati rice', amount: '2', unit: 'cups' },
      { name: 'Mixed vegetables', amount: '3', unit: 'cups' },
      { name: 'Fried onions', amount: '1', unit: 'cup' },
      { name: 'Saffron', amount: '1', unit: 'pinch' },
      { name: 'Yogurt', amount: '0.5', unit: 'cup' },
      { name: 'Biryani masala', amount: '2', unit: 'tbsp' },
      { name: 'Ghee', amount: '3', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Parboil the rice', detail: 'Soak and parboil basmati rice with whole spices for 5-6 minutes until 70% cooked.' },
      { step: 2, title: 'Prepare vegetables', detail: 'Marinate vegetables in yogurt with biryani masala. Cook until partially done.' },
      { step: 3, title: 'Layer the biryani', detail: 'Layer rice over vegetables. Add saffron milk, fried onions, and mint on top.' },
      { step: 4, title: 'Dum cooking', detail: 'Seal pot and cook on low heat for 25-30 minutes. Let rest before serving.' }
    ],
    alternativeIngredients: ['Paneer instead of vegetables', 'Brown rice for healthier option'],
    tags: ['indian', 'rice', 'vegetarian', 'biryani']
  },
  {
    title: 'Miso Ramen with Chashu Pork',
    description: 'Rich and comforting Japanese noodle soup with slow-braised pork belly and savory miso broth.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 180,
    servings: 4,
    difficulty: 'Hard',
    ingredients: [
      { name: 'Pork belly', amount: '500', unit: 'g' },
      { name: 'Ramen noodles', amount: '4', unit: 'portions' },
      { name: 'Miso paste', amount: '4', unit: 'tbsp' },
      { name: 'Chicken stock', amount: '6', unit: 'cups' },
      { name: 'Eggs', amount: '4', unit: 'large' },
      { name: 'Green onions', amount: '4', unit: 'stalks' },
      { name: 'Nori sheets', amount: '4', unit: 'pieces' }
    ],
    instructions: [
      { step: 1, title: 'Make chashu pork', detail: 'Roll pork belly and tie. Sear, then braise with soy, mirin, sake for 2 hours.' },
      { step: 2, title: 'Soft-boiled eggs', detail: 'Boil eggs 6.5 minutes, shock in ice bath, peel and marinate in chashu liquid.' },
      { step: 3, title: 'Make miso broth', detail: 'Heat chicken stock. Dissolve miso paste in a ladle of stock, stir back in. Do not boil.' },
      { step: 4, title: 'Cook noodles', detail: 'Cook ramen noodles 2-3 minutes. Drain and place in bowls.' },
      { step: 5, title: 'Assemble', detail: 'Ladle hot broth over noodles. Arrange chashu, egg, corn, and green onions.' }
    ],
    alternativeIngredients: ['Chicken instead of pork belly', 'Rice noodles for gluten-free'],
    tags: ['japanese', 'ramen', 'noodles', 'pork']
  },
  {
    title: 'French Onion Soup',
    description: 'Caramelized onions in rich beef broth, topped with crusty bread and melted Gruyère cheese.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
    cuisine: 'French',
    prepTime: 90,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Yellow onions', amount: '6', unit: 'large' },
      { name: 'Beef stock', amount: '6', unit: 'cups' },
      { name: 'Gruyère cheese', amount: '200', unit: 'g' },
      { name: 'Baguette', amount: '1', unit: 'loaf' },
      { name: 'Butter', amount: '4', unit: 'tbsp' },
      { name: 'Dry sherry', amount: '0.5', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Caramelize onions', detail: 'Cook onions in butter on medium heat for 45-60 minutes, stirring occasionally, until deep golden.' },
      { step: 2, title: 'Deglaze and add stock', detail: 'Add sherry, scrape pan. Add beef stock and thyme. Simmer 20 minutes.' },
      { step: 3, title: 'Prepare bread', detail: 'Slice baguette and toast under broiler until golden and crisp.' },
      { step: 4, title: 'Assemble and broil', detail: 'Ladle soup into oven-safe bowls, float bread, cover with Gruyère. Broil until bubbling and golden.' }
    ],
    alternativeIngredients: ['Vegetable stock for vegetarian', 'Swiss cheese instead of Gruyère'],
    tags: ['french', 'soup', 'cheese', 'comfort food']
  },
  {
    title: 'Kung Pao Chicken',
    description: 'Spicy Sichuan stir-fry with tender chicken, peanuts, vegetables, and dried chilies.',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop',
    cuisine: 'Chinese',
    prepTime: 30,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken breast', amount: '500', unit: 'g' },
      { name: 'Roasted peanuts', amount: '0.5', unit: 'cup' },
      { name: 'Dried red chilies', amount: '10', unit: 'pieces' },
      { name: 'Sichuan peppercorns', amount: '1', unit: 'tsp' },
      { name: 'Soy sauce', amount: '3', unit: 'tbsp' },
      { name: 'Rice vinegar', amount: '2', unit: 'tbsp' },
      { name: 'Hoisin sauce', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Velvet the chicken', detail: 'Marinate chicken cubes in soy sauce, cornstarch, and egg white for 20 minutes.' },
      { step: 2, title: 'Prepare the sauce', detail: 'Mix soy sauce, rice vinegar, hoisin sauce, sugar, and cornstarch slurry.' },
      { step: 3, title: 'Cook the chicken', detail: 'Fry chicken in hot wok until golden. Remove and set aside.' },
      { step: 4, title: 'Combine', detail: 'Fry chilies and peppercorns. Return chicken, add vegetables and sauce. Toss with peanuts.' }
    ],
    alternativeIngredients: ['Tofu instead of chicken', 'Cashews instead of peanuts'],
    tags: ['chinese', 'stir-fry', 'spicy', 'peanuts']
  },
  {
    title: 'Mediterranean Grilled Sea Bass',
    description: 'Whole sea bass stuffed with herbs and lemon, grilled to perfection with olive oil.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=600&fit=crop',
    cuisine: 'Mediterranean',
    prepTime: 35,
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Whole sea bass', amount: '2', unit: 'pieces' },
      { name: 'Lemon', amount: '2', unit: 'whole' },
      { name: 'Fresh rosemary', amount: '4', unit: 'sprigs' },
      { name: 'Garlic', amount: '4', unit: 'cloves' },
      { name: 'Olive oil', amount: '0.25', unit: 'cup' },
      { name: 'Cherry tomatoes', amount: '1', unit: 'cup' },
      { name: 'Kalamata olives', amount: '0.5', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Prepare the fish', detail: 'Score the skin diagonally 3 times on each side. Season inside and out.' },
      { step: 2, title: 'Stuff the fish', detail: 'Fill cavity with lemon slices, rosemary, thyme, and garlic. Drizzle with olive oil.' },
      { step: 3, title: 'Grill', detail: 'Grill on oiled grates for 5-6 minutes per side until flesh flakes easily.' },
      { step: 4, title: 'Serve', detail: 'Top with grilled tomatoes and olives. Squeeze fresh lemon juice over all.' }
    ],
    alternativeIngredients: ['Branzino or red snapper instead of sea bass', 'Dried herbs if fresh unavailable'],
    tags: ['mediterranean', 'seafood', 'grilled', 'healthy']
  },
  {
    title: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheese, fresh toppings, and secret sauce on a toasted bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    cuisine: 'American',
    prepTime: 25,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Ground beef', amount: '600', unit: 'g' },
      { name: 'Burger buns', amount: '4', unit: 'pieces' },
      { name: 'Cheddar cheese', amount: '4', unit: 'slices' },
      { name: 'Lettuce', amount: '4', unit: 'leaves' },
      { name: 'Tomato', amount: '1', unit: 'large' },
      { name: 'Pickles', amount: '8', unit: 'slices' }
    ],
    instructions: [
      { step: 1, title: 'Form patties', detail: 'Gently form ground beef into 4 patties. Make slight indent in center to prevent puffing.' },
      { step: 2, title: 'Season and cook', detail: 'Season with salt and pepper. Grill or pan-sear on high for 3-4 minutes per side.' },
      { step: 3, title: 'Add cheese', detail: 'Place cheese on patty in last minute of cooking to melt.' },
      { step: 4, title: 'Assemble', detail: 'Toast buns. Layer with sauce, lettuce, patty, tomato, and pickles.' }
    ],
    alternativeIngredients: ['Turkey or veggie patty', 'Swiss or blue cheese'],
    tags: ['american', 'burger', 'beef', 'classic']
  },
  {
    title: 'Philly Cheese Steak',
    description: 'Authentic Philadelphia cheesesteak with thinly sliced ribeye, caramelized onions, and melted provolone on a hoagie roll.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=600&fit=crop',
    cuisine: 'American',
    prepTime: 30,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Ribeye steak', amount: '500', unit: 'g' },
      { name: 'Hoagie rolls', amount: '4', unit: 'pieces' },
      { name: 'Provolone cheese', amount: '200', unit: 'g' },
      { name: 'Onions', amount: '2', unit: 'large' },
      { name: 'Bell peppers', amount: '2', unit: 'medium' },
      { name: 'Mushrooms', amount: '150', unit: 'g' },
      { name: 'Oil', amount: '2', unit: 'tbsp' },
      { name: 'Salt and pepper', amount: '1', unit: 'tsp' }
    ],
    instructions: [
      { step: 1, title: 'Prepare the meat', detail: 'Partially freeze ribeye for easier slicing. Slice paper-thin against the grain using a sharp knife.' },
      { step: 2, title: 'Caramelize vegetables', detail: 'Sauté sliced onions, bell peppers, and mushrooms in oil over medium heat until soft and golden, about 10-12 minutes.' },
      { step: 3, title: 'Cook the steak', detail: 'Heat a griddle or large skillet over high heat. Add sliced ribeye and cook quickly, breaking it up as it cooks, about 3-4 minutes.' },
      { step: 4, title: 'Add cheese', detail: 'Mix vegetables with the cooked steak. Top with provolone cheese slices and cover briefly to melt.' },
      { step: 5, title: 'Assemble sandwiches', detail: 'Split hoagie rolls lengthwise. Pile the cheesy steak mixture generously into each roll. Serve immediately while hot and gooey.' }
    ],
    alternativeIngredients: ['Cheez Whiz instead of provolone', 'American cheese for classic version', 'Add jalapeños for heat'],
    tags: ['american', 'sandwich', 'steak', 'philadelphia', 'cheese']
  },
  {
    title: 'Pad Thai',
    description: 'Thailand\'s famous stir-fried rice noodles with shrimp, tofu, peanuts, and tamarind.',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=600&fit=crop',
    cuisine: 'Thai',
    prepTime: 35,
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Rice noodles', amount: '200', unit: 'g' },
      { name: 'Shrimp', amount: '200', unit: 'g' },
      { name: 'Tofu', amount: '150', unit: 'g' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Bean sprouts', amount: '1', unit: 'cup' },
      { name: 'Tamarind paste', amount: '3', unit: 'tbsp' },
      { name: 'Fish sauce', amount: '3', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Soak noodles', detail: 'Soak rice noodles in warm water until pliable, about 30 minutes.' },
      { step: 2, title: 'Make sauce', detail: 'Mix tamarind, fish sauce, and palm sugar. Taste and adjust balance.' },
      { step: 3, title: 'Stir fry', detail: 'Cook shrimp, then tofu, then eggs. Add noodles and sauce. Toss well.' },
      { step: 4, title: 'Serve', detail: 'Add bean sprouts, peanuts, and green onions. Serve with lime wedges.' }
    ],
    alternativeIngredients: ['Chicken instead of shrimp', 'Gluten-free soy sauce'],
    tags: ['thai', 'noodles', 'stir-fry', 'seafood']
  },
  {
    title: 'Fried Chicken',
    description: 'Crispy, juicy fried chicken with a perfectly seasoned buttermilk coating.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=600&fit=crop',
    cuisine: 'American',
    prepTime: 120,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken pieces', amount: '8', unit: 'pieces' },
      { name: 'Buttermilk', amount: '2', unit: 'cups' },
      { name: 'Flour', amount: '2', unit: 'cups' },
      { name: 'Paprika', amount: '2', unit: 'tbsp' },
      { name: 'Garlic powder', amount: '1', unit: 'tbsp' },
      { name: 'Cayenne', amount: '1', unit: 'tsp' }
    ],
    instructions: [
      { step: 1, title: 'Marinate', detail: 'Soak chicken in seasoned buttermilk for at least 4 hours or overnight.' },
      { step: 2, title: 'Dredge', detail: 'Toss chicken in seasoned flour. Double dredge for extra crunch.' },
      { step: 3, title: 'Fry', detail: 'Fry in 350°F oil for 12-15 minutes until golden and cooked through.' },
      { step: 4, title: 'Rest', detail: 'Drain on wire rack. Season with salt while hot.' }
    ],
    alternativeIngredients: ['Air fryer method for less oil', 'Oven-baked version'],
    tags: ['american', 'fried', 'chicken', 'comfort food']
  },
  {
    title: 'Palak Paneer',
    description: 'Creamy spinach curry with fresh cottage cheese cubes - a vegetarian delight.',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&h=600&fit=crop',
    cuisine: 'Indian',
    prepTime: 45,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Spinach', amount: '500', unit: 'g' },
      { name: 'Paneer', amount: '250', unit: 'g' },
      { name: 'Onion', amount: '1', unit: 'large' },
      { name: 'Tomato', amount: '2', unit: 'medium' },
      { name: 'Ginger-garlic paste', amount: '1', unit: 'tbsp' },
      { name: 'Garam masala', amount: '1', unit: 'tsp' },
      { name: 'Cream', amount: '0.25', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Blanch spinach', detail: 'Boil spinach for 2 minutes, plunge in ice water, then blend to smooth puree.' },
      { step: 2, title: 'Fry paneer', detail: 'Cube paneer and lightly fry until golden. Soak in warm water to keep soft.' },
      { step: 3, title: 'Make curry base', detail: 'Sauté onions until golden. Add ginger-garlic and tomatoes. Cook until soft.' },
      { step: 4, title: 'Combine', detail: 'Add spinach puree and spices. Simmer 10 minutes. Add paneer and cream.' }
    ],
    alternativeIngredients: ['Tofu instead of paneer', 'Mustard greens instead of spinach'],
    tags: ['indian', 'vegetarian', 'paneer', 'spinach']
  },
  {
    title: 'Gyoza',
    description: 'Pan-fried Japanese dumplings with juicy pork filling and crispy bottoms.',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 60,
    servings: 24,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Ground pork', amount: '300', unit: 'g' },
      { name: 'Gyoza wrappers', amount: '24', unit: 'pieces' },
      { name: 'Cabbage', amount: '1', unit: 'cup' },
      { name: 'Garlic chives', amount: '0.5', unit: 'cup' },
      { name: 'Soy sauce', amount: '2', unit: 'tbsp' },
      { name: 'Sesame oil', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Make filling', detail: 'Mix ground pork with minced cabbage, chives, ginger, soy sauce, and sesame oil.' },
      { step: 2, title: 'Wrap', detail: 'Place filling in wrapper. Moisten edges, fold, and pleat one side.' },
      { step: 3, title: 'Pan fry', detail: 'Heat oil in skillet. Cook gyoza flat-side down until bottoms are golden.' },
      { step: 4, title: 'Steam', detail: 'Add water, cover immediately. Steam 3-4 minutes then uncover to crisp.' }
    ],
    alternativeIngredients: ['Chicken or vegetable filling', 'Shrimp and pork filling'],
    tags: ['japanese', 'dumplings', 'pork', 'pan-fried']
  },
  {
    title: 'Greek Salad',
    description: 'Fresh, crisp salad with tomatoes, cucumbers, olives, and feta cheese.',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop',
    cuisine: 'Mediterranean',
    prepTime: 15,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Tomatoes', amount: '4', unit: 'large' },
      { name: 'Cucumber', amount: '1', unit: 'large' },
      { name: 'Red onion', amount: '0.5', unit: 'medium' },
      { name: 'Kalamata olives', amount: '1', unit: 'cup' },
      { name: 'Feta cheese', amount: '200', unit: 'g' },
      { name: 'Olive oil', amount: '0.25', unit: 'cup' },
      { name: 'Oregano', amount: '1', unit: 'tsp' }
    ],
    instructions: [
      { step: 1, title: 'Prep vegetables', detail: 'Cut tomatoes into wedges, slice cucumber, thinly slice red onion.' },
      { step: 2, title: 'Assemble', detail: 'Arrange vegetables on a platter. Scatter olives over top.' },
      { step: 3, title: 'Add feta', detail: 'Place whole block of feta on top (traditional) or crumble over salad.' },
      { step: 4, title: 'Dress', detail: 'Drizzle with olive oil, sprinkle oregano and salt. Serve with crusty bread.' }
    ],
    alternativeIngredients: ['Add bell peppers', 'Use fresh oregano'],
    tags: ['mediterranean', 'greek', 'salad', 'vegetarian']
  },
  {
    title: 'Carnitas Tacos',
    description: 'Slow-cooked pulled pork with crispy edges - perfect for tacos.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=600&fit=crop',
    cuisine: 'Mexican',
    prepTime: 180,
    servings: 8,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Pork shoulder', amount: '1.5', unit: 'kg' },
      { name: 'Orange', amount: '2', unit: 'pieces' },
      { name: 'Corn tortillas', amount: '16', unit: 'pieces' },
      { name: 'Garlic', amount: '6', unit: 'cloves' },
      { name: 'Cumin', amount: '2', unit: 'tsp' },
      { name: 'Cilantro', amount: '1', unit: 'bunch' },
      { name: 'Lime', amount: '4', unit: 'pieces' }
    ],
    instructions: [
      { step: 1, title: 'Season pork', detail: 'Cut into large chunks. Season with salt, cumin, and garlic.' },
      { step: 2, title: 'Slow cook', detail: 'Simmer with orange juice in pot for 3 hours until tender.' },
      { step: 3, title: 'Crisp', detail: 'Shred pork. Spread on baking sheet and broil until edges crisp up.' },
      { step: 4, title: 'Serve', detail: 'Serve in warm tortillas with onion, cilantro, and lime.' }
    ],
    alternativeIngredients: ['Chicken thighs', 'Flour tortillas'],
    tags: ['mexican', 'pork', 'tacos', 'slow cook']
  },
  {
    title: 'Coq au Vin',
    description: 'Classic French chicken braised in red wine with mushrooms and pearl onions.',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=600&fit=crop',
    cuisine: 'French',
    prepTime: 120,
    servings: 6,
    difficulty: 'Hard',
    ingredients: [
      { name: 'Chicken pieces', amount: '1.5', unit: 'kg' },
      { name: 'Red wine', amount: '750', unit: 'ml' },
      { name: 'Bacon', amount: '200', unit: 'g' },
      { name: 'Pearl onions', amount: '20', unit: 'pieces' },
      { name: 'Mushrooms', amount: '300', unit: 'g' },
      { name: 'Carrots', amount: '3', unit: 'medium' },
      { name: 'Thyme', amount: '4', unit: 'sprigs' }
    ],
    instructions: [
      { step: 1, title: 'Marinate chicken', detail: 'Marinate chicken in wine with vegetables and herbs overnight for best flavor.' },
      { step: 2, title: 'Brown chicken', detail: 'Remove from marinade, pat dry, and brown in batches in hot pot.' },
      { step: 3, title: 'Cook vegetables', detail: 'Sauté bacon, onions, mushrooms, and carrots until golden.' },
      { step: 4, title: 'Braise', detail: 'Return chicken to pot with reserved wine. Cover and simmer 1 hour until tender.' }
    ],
    alternativeIngredients: ['Use white wine for coq au riesling', 'Add brandy for depth'],
    tags: ['french', 'chicken', 'wine', 'braised']
  },
  {
    title: 'Shakshuka',
    description: 'Eggs poached in spicy tomato sauce - a North African breakfast favorite.',
    image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&h=600&fit=crop',
    cuisine: 'Mediterranean',
    prepTime: 35,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Eggs', amount: '6', unit: 'large' },
      { name: 'Tomatoes', amount: '800', unit: 'g' },
      { name: 'Bell peppers', amount: '2', unit: 'pieces' },
      { name: 'Onion', amount: '1', unit: 'large' },
      { name: 'Garlic', amount: '4', unit: 'cloves' },
      { name: 'Paprika', amount: '2', unit: 'tsp' },
      { name: 'Feta cheese', amount: '100', unit: 'g' }
    ],
    instructions: [
      { step: 1, title: 'Sauté vegetables', detail: 'Cook onion and peppers. Add garlic, cumin, and paprika. Cook 1 minute.' },
      { step: 2, title: 'Add tomatoes', detail: 'Add crushed tomatoes. Simmer 10 minutes until thickened and rich.' },
      { step: 3, title: 'Add eggs', detail: 'Make wells in sauce. Crack eggs into wells. Cover, cook 5-8 minutes.' },
      { step: 4, title: 'Serve', detail: 'Top with crumbled feta and fresh herbs. Serve with crusty bread.' }
    ],
    alternativeIngredients: ['Add merguez sausage', 'Use harissa for extra spice'],
    tags: ['mediterranean', 'eggs', 'tomato', 'breakfast']
  },
  {
    title: 'Tonkatsu',
    description: 'Crispy breaded pork cutlet served with tangy tonkatsu sauce and shredded cabbage.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 40,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Pork loin', amount: '2', unit: 'pieces' },
      { name: 'Panko breadcrumbs', amount: '2', unit: 'cups' },
      { name: 'Flour', amount: '0.5', unit: 'cup' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Cabbage', amount: '0.5', unit: 'head' },
      { name: 'Tonkatsu sauce', amount: '0.25', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Prepare pork', detail: 'Pound pork cutlets to even thickness. Season with salt and pepper.' },
      { step: 2, title: 'Dredge', detail: 'Dredge in flour, dip in beaten eggs, then coat thickly with panko.' },
      { step: 3, title: 'Fry', detail: 'Deep fry at 340°F for 3-4 minutes per side until golden and cooked through.' },
      { step: 4, title: 'Serve', detail: 'Slice into strips. Serve over shredded cabbage with tonkatsu sauce.' }
    ],
    alternativeIngredients: ['Chicken breast instead of pork', 'Regular breadcrumbs'],
    tags: ['japanese', 'pork', 'fried', 'breaded']
  },
  {
    title: 'Churros',
    description: 'Crispy fried dough pastries coated in cinnamon sugar, perfect with chocolate.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=600&fit=crop',
    cuisine: 'Mexican',
    prepTime: 40,
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Water', amount: '1', unit: 'cup' },
      { name: 'Butter', amount: '0.5', unit: 'cup' },
      { name: 'Flour', amount: '1', unit: 'cup' },
      { name: 'Eggs', amount: '3', unit: 'large' },
      { name: 'Sugar', amount: '0.5', unit: 'cup' },
      { name: 'Cinnamon', amount: '2', unit: 'tsp' },
      { name: 'Oil', amount: '4', unit: 'cups' }
    ],
    instructions: [
      { step: 1, title: 'Make dough', detail: 'Boil water and butter. Add flour all at once, stir until dough forms a ball.' },
      { step: 2, title: 'Add eggs', detail: 'Cool slightly. Add eggs one at a time, beating well after each addition.' },
      { step: 3, title: 'Pipe and fry', detail: 'Pipe dough using star tip into hot oil. Fry until golden brown.' },
      { step: 4, title: 'Coat', detail: 'Roll in cinnamon sugar while warm. Serve with hot chocolate for dipping.' }
    ],
    alternativeIngredients: ['Fill with dulce de leche', 'Dip in caramel sauce'],
    tags: ['mexican', 'dessert', 'fried', 'sweet']
  },
  {
    title: 'Mapo Tofu',
    description: 'Spicy Sichuan tofu with minced pork in a fiery chili bean sauce.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    cuisine: 'Chinese',
    prepTime: 30,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Soft tofu', amount: '600', unit: 'g' },
      { name: 'Ground pork', amount: '150', unit: 'g' },
      { name: 'Doubanjiang', amount: '2', unit: 'tbsp' },
      { name: 'Sichuan peppercorns', amount: '1', unit: 'tsp' },
      { name: 'Chicken stock', amount: '0.5', unit: 'cup' },
      { name: 'Cornstarch', amount: '1', unit: 'tbsp' },
      { name: 'Green onions', amount: '3', unit: 'stalks' }
    ],
    instructions: [
      { step: 1, title: 'Blanch tofu', detail: 'Cut tofu into cubes. Simmer gently in salted water 2 minutes. Drain carefully.' },
      { step: 2, title: 'Fry pork', detail: 'Fry ground pork until crispy. Add doubanjiang, black beans, and ginger.' },
      { step: 3, title: 'Simmer', detail: 'Add stock and tofu. Simmer gently 5 minutes. Thicken with cornstarch slurry.' },
      { step: 4, title: 'Finish', detail: 'Add Sichuan peppercorn oil and green onions. Serve over steamed rice.' }
    ],
    alternativeIngredients: ['Chicken instead of pork', 'Skip meat for vegetarian version'],
    tags: ['chinese', 'sichuan', 'tofu', 'spicy']
  },
  {
    title: 'Crème Brûlée',
    description: 'Rich custard with caramelized sugar crust - a classic French dessert.',
    image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=800&h=600&fit=crop',
    cuisine: 'French',
    prepTime: 60,
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Heavy cream', amount: '2', unit: 'cups' },
      { name: 'Egg yolks', amount: '6', unit: 'large' },
      { name: 'Sugar', amount: '0.5', unit: 'cup' },
      { name: 'Vanilla bean', amount: '1', unit: 'piece' },
      { name: 'Sugar for topping', amount: '0.25', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Heat cream', detail: 'Heat cream with vanilla seeds until steaming. Remove and let infuse 15 minutes.' },
      { step: 2, title: 'Make custard', detail: 'Whisk yolks with sugar. Gradually add warm cream. Strain.' },
      { step: 3, title: 'Bake', detail: 'Pour into ramekins. Bake in water bath at 325°F for 35-40 minutes until just set.' },
      { step: 4, title: 'Caramelize', detail: 'Chill 4 hours. Sprinkle sugar on top. Torch until golden and crisp.' }
    ],
    alternativeIngredients: ['Add lavender', 'Coffee or chocolate variation'],
    tags: ['french', 'dessert', 'custard', 'classic']
  },
  {
    title: 'Chana Masala',
    description: 'Spiced chickpea curry with tangy tomatoes and aromatic spices - a North Indian staple.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    cuisine: 'Indian',
    prepTime: 45,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chickpeas', amount: '2', unit: 'cans' },
      { name: 'Onion', amount: '2', unit: 'large' },
      { name: 'Tomatoes', amount: '3', unit: 'medium' },
      { name: 'Ginger-garlic paste', amount: '2', unit: 'tbsp' },
      { name: 'Chana masala powder', amount: '2', unit: 'tbsp' },
      { name: 'Amchur', amount: '1', unit: 'tsp' },
      { name: 'Cilantro', amount: '0.5', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Fry onions', detail: 'Fry onions until deep golden brown - this is crucial for authentic flavor.' },
      { step: 2, title: 'Add aromatics', detail: 'Add ginger-garlic paste, tomatoes, and spices. Cook until tomatoes break down.' },
      { step: 3, title: 'Simmer chickpeas', detail: 'Add chickpeas with liquid and water. Simmer 30 minutes.' },
      { step: 4, title: 'Finish', detail: 'Mash some chickpeas to thicken. Add amchur and garnish with cilantro.' }
    ],
    alternativeIngredients: ['Dried chickpeas soaked overnight', 'Lemon juice instead of amchur'],
    tags: ['indian', 'vegetarian', 'chickpeas', 'curry']
  },
  {
    title: 'Paella',
    description: 'Spanish rice dish with seafood, chicken, and saffron cooked in a traditional pan.',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800&h=600&fit=crop',
    cuisine: 'Mediterranean',
    prepTime: 60,
    servings: 6,
    difficulty: 'Hard',
    ingredients: [
      { name: 'Bomba rice', amount: '400', unit: 'g' },
      { name: 'Shrimp', amount: '300', unit: 'g' },
      { name: 'Chicken thighs', amount: '300', unit: 'g' },
      { name: 'Mussels', amount: '500', unit: 'g' },
      { name: 'Saffron', amount: '1', unit: 'pinch' },
      { name: 'Bell peppers', amount: '2', unit: 'pieces' },
      { name: 'Chicken stock', amount: '4', unit: 'cups' }
    ],
    instructions: [
      { step: 1, title: 'Sear proteins', detail: 'Brown chicken and shrimp in paella pan. Remove and set aside.' },
      { step: 2, title: 'Sofrito', detail: 'Sauté peppers, garlic, and tomatoes. Add paprika and saffron.' },
      { step: 3, title: 'Add rice', detail: 'Add rice and coat with sofrito. Pour in hot stock. Do not stir from now on.' },
      { step: 4, title: 'Cook', detail: 'Arrange proteins and mussels on top. Cook 20 minutes to form socarrat crust.' }
    ],
    alternativeIngredients: ['Add chorizo', 'All-seafood version'],
    tags: ['mediterranean', 'spanish', 'rice', 'seafood']
  },
  // ADDITIONAL ITALIAN RECIPES
  {
    title: 'Spaghetti Carbonara',
    description: 'Authentic Roman pasta with eggs, Pecorino Romano, guanciale, and black pepper. No cream!',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop',
    cuisine: 'Italian',
    prepTime: 25,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Spaghetti', amount: '400', unit: 'g' },
      { name: 'Guanciale', amount: '150', unit: 'g' },
      { name: 'Egg yolks', amount: '4', unit: 'large' },
      { name: 'Pecorino Romano', amount: '100', unit: 'g' },
      { name: 'Black pepper', amount: '2', unit: 'tsp' },
      { name: 'Salt', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Cook pasta', detail: 'Boil spaghetti in salted water until al dente. Reserve 1 cup pasta water.' },
      { step: 2, title: 'Render guanciale', detail: 'Cook guanciale in a large pan until crispy. Remove from heat.' },
      { step: 3, title: 'Make sauce', detail: 'Whisk egg yolks with grated Pecorino and plenty of black pepper.' },
      { step: 4, title: 'Combine', detail: 'Add hot pasta to the pan with guanciale. Quickly mix in egg mixture, using pasta water to create creamy sauce.' }
    ],
    alternativeIngredients: ['Pancetta instead of guanciale', 'Parmesan instead of Pecorino'],
    tags: ['italian', 'pasta', 'roman', 'comfort food']
  },
  {
    title: 'Osso Buco alla Milanese',
    description: 'Braised veal shanks in white wine and broth, served with gremolata. A Milanese classic.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
    cuisine: 'Italian',
    prepTime: 150,
    servings: 4,
    difficulty: 'Hard',
    ingredients: [
      { name: 'Veal shanks', amount: '4', unit: 'pieces' },
      { name: 'White wine', amount: '1', unit: 'cup' },
      { name: 'Vegetable broth', amount: '2', unit: 'cups' },
      { name: 'Onion', amount: '1', unit: 'large' },
      { name: 'Carrots', amount: '2', unit: 'medium' },
      { name: 'Celery', amount: '2', unit: 'stalks' },
      { name: 'Tomato paste', amount: '2', unit: 'tbsp' },
      { name: 'Gremolata', amount: '0.25', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Sear shanks', detail: 'Dredge veal in flour, sear in hot oil until golden brown on all sides.' },
      { step: 2, title: 'Sauté vegetables', detail: 'Cook onion, carrots, and celery until softened. Add tomato paste.' },
      { step: 3, title: 'Deglaze', detail: 'Add white wine, scraping up browned bits. Reduce by half.' },
      { step: 4, title: 'Braise', detail: 'Add broth and shanks. Cover and simmer 2 hours until meat falls off bone.' },
      { step: 5, title: 'Serve', detail: 'Top with fresh gremolata (parsley, lemon zest, garlic).' }
    ],
    alternativeIngredients: ['Beef shanks instead of veal', 'Red wine instead of white'],
    tags: ['italian', 'milanese', 'veal', 'braised']
  },
  {
    title: 'Eggplant Parmigiana',
    description: 'Layers of fried eggplant, tomato sauce, mozzarella, and Parmesan baked to perfection.',
    image: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=800&h=600&fit=crop',
    cuisine: 'Italian',
    prepTime: 90,
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Eggplants', amount: '2', unit: 'large' },
      { name: 'Mozzarella', amount: '400', unit: 'g' },
      { name: 'Parmesan', amount: '100', unit: 'g' },
      { name: 'Tomato sauce', amount: '800', unit: 'g' },
      { name: 'Basil', amount: '1', unit: 'bunch' },
      { name: 'Breadcrumbs', amount: '1', unit: 'cup' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Flour', amount: '1', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Prepare eggplant', detail: 'Slice eggplant, salt and drain for 30 minutes. Pat dry.' },
      { step: 2, title: 'Bread and fry', detail: 'Dredge in flour, egg, then breadcrumbs. Fry until golden.' },
      { step: 3, title: 'Layer', detail: 'In baking dish, layer sauce, eggplant, mozzarella, Parmesan, and basil.' },
      { step: 4, title: 'Bake', detail: 'Bake at 375°F (190°C) for 30 minutes until bubbly and golden.' }
    ],
    alternativeIngredients: ['Grilled eggplant for lighter version', 'Provolone instead of mozzarella'],
    tags: ['italian', 'vegetarian', 'baked', 'comfort food']
  },
  {
    title: 'Authentic Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop',
    cuisine: 'Italian',
    prepTime: 30,
    servings: 8,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Ladyfingers', amount: '200', unit: 'g' },
      { name: 'Mascarpone', amount: '500', unit: 'g' },
      { name: 'Espresso', amount: '1.5', unit: 'cups' },
      { name: 'Eggs', amount: '4', unit: 'large' },
      { name: 'Sugar', amount: '100', unit: 'g' },
      { name: 'Cocoa powder', amount: '2', unit: 'tbsp' },
      { name: 'Marsala wine', amount: '2', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Make cream', detail: 'Beat egg yolks with sugar until pale. Fold in mascarpone.' },
      { step: 2, title: 'Whip whites', detail: 'Beat egg whites to stiff peaks. Gently fold into mascarpone mixture.' },
      { step: 3, title: 'Assemble', detail: 'Dip ladyfingers in coffee mixture. Layer with mascarpone cream.' },
      { step: 4, title: 'Chill', detail: 'Refrigerate at least 4 hours. Dust with cocoa before serving.' }
    ],
    alternativeIngredients: ['Rum instead of Marsala', 'Cream instead of egg whites'],
    tags: ['italian', 'dessert', 'no-bake', 'coffee']
  },
  {
    title: 'Lasagna alla Bolognese',
    description: 'Traditional layered pasta with rich meat sauce, béchamel, and cheese.',
    image: 'https://images.unsplash.com/photo-1574868235872-1663edcb4569?w=800&h=600&fit=crop',
    cuisine: 'Italian',
    prepTime: 180,
    servings: 8,
    difficulty: 'Hard',
    ingredients: [
      { name: 'Lasagna sheets', amount: '500', unit: 'g' },
      { name: 'Ground beef', amount: '500', unit: 'g' },
      { name: 'Pork sausage', amount: '300', unit: 'g' },
      { name: 'Béchamel sauce', amount: '4', unit: 'cups' },
      { name: 'Tomato paste', amount: '3', unit: 'tbsp' },
      { name: 'Parmesan', amount: '200', unit: 'g' },
      { name: 'Red wine', amount: '1', unit: 'cup' },
      { name: 'Nutmeg', amount: '0.25', unit: 'tsp' }
    ],
    instructions: [
      { step: 1, title: 'Make ragù', detail: 'Brown meats, add wine, tomatoes. Simmer 2 hours.' },
      { step: 2, title: 'Make béchamel', detail: 'Cook butter and flour, whisk in milk until thickened. Season with nutmeg.' },
      { step: 3, title: 'Cook pasta', detail: 'Boil lasagna sheets until al dente. Drain and lay flat.' },
      { step: 4, title: 'Layer', detail: 'Alternate layers of ragù, béchamel, pasta, and Parmesan in baking dish.' },
      { step: 5, title: 'Bake', detail: 'Bake at 375°F for 45 minutes. Rest 15 minutes before serving.' }
    ],
    alternativeIngredients: ['Ricotta instead of béchamel', 'Turkey instead of beef'],
    tags: ['italian', 'pasta', 'baked', 'family meal']
  },
  // ADDITIONAL INDIAN RECIPES
  {
    title: 'Chicken Tikka Masala',
    description: 'Grilled chicken chunks in a creamy spiced tomato sauce - a British-Indian favorite.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop',
    cuisine: 'Indian',
    prepTime: 60,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken breast', amount: '600', unit: 'g' },
      { name: 'Yogurt', amount: '1', unit: 'cup' },
      { name: 'Tomato puree', amount: '400', unit: 'g' },
      { name: 'Heavy cream', amount: '0.5', unit: 'cup' },
      { name: 'Garam masala', amount: '2', unit: 'tbsp' },
      { name: 'Fenugreek leaves', amount: '2', unit: 'tbsp' },
      { name: 'Ginger-garlic paste', amount: '2', unit: 'tbsp' },
      { name: 'Kasuri methi', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Marinate chicken', detail: 'Cut chicken into chunks. Marinate in yogurt with spices for 30 minutes.' },
      { step: 2, title: 'Grill chicken', detail: 'Thread onto skewers and grill until charred and cooked through.' },
      { step: 3, title: 'Make sauce', detail: 'Sauté onions, tomatoes, and spices. Blend until smooth.' },
      { step: 4, title: 'Combine', detail: 'Add grilled chicken to sauce. Stir in cream and fenugreek. Simmer 10 minutes.' }
    ],
    alternativeIngredients: ['Paneer instead of chicken', 'Coconut milk instead of cream'],
    tags: ['indian', 'curry', 'chicken', 'creamy']
  },
  {
    title: 'Palak Paneer',
    description: 'Creamy spinach curry with fresh paneer cheese - a vegetarian North Indian classic.',
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&h=600&fit=crop',
    cuisine: 'Indian',
    prepTime: 45,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Spinach', amount: '500', unit: 'g' },
      { name: 'Paneer', amount: '250', unit: 'g' },
      { name: 'Onion', amount: '1', unit: 'large' },
      { name: 'Tomato', amount: '2', unit: 'medium' },
      { name: 'Ginger', amount: '1', unit: 'inch' },
      { name: 'Green chilies', amount: '2', unit: 'pieces' },
      { name: 'Cream', amount: '0.25', unit: 'cup' },
      { name: 'Cumin seeds', amount: '1', unit: 'tsp' }
    ],
    instructions: [
      { step: 1, title: 'Blanch spinach', detail: 'Boil spinach 2 minutes, then plunge in ice water. Blend to smooth puree.' },
      { step: 2, title: 'Fry paneer', detail: 'Cube paneer and lightly fry until golden. Set aside.' },
      { step: 3, title: 'Make masala', detail: 'Sauté cumin, onions, ginger, and tomatoes until soft. Blend if desired.' },
      { step: 4, title: 'Combine', detail: 'Add spinach puree to masala. Simmer, then add paneer and cream.' }
    ],
    alternativeIngredients: ['Tofu instead of paneer', 'Mustard greens instead of spinach'],
    tags: ['indian', 'vegetarian', 'spinach', 'healthy']
  },
  {
    title: 'Rogan Josh',
    description: 'Aromatic Kashmiri lamb curry with deep red color from Kashmiri chilies.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
    cuisine: 'Indian',
    prepTime: 120,
    servings: 6,
    difficulty: 'Hard',
    ingredients: [
      { name: 'Lamb shoulder', amount: '1', unit: 'kg' },
      { name: 'Kashmiri chilies', amount: '6', unit: 'dried' },
      { name: 'Yogurt', amount: '1', unit: 'cup' },
      { name: 'Fennel seeds', amount: '2', unit: 'tsp' },
      { name: 'Ginger powder', amount: '1', unit: 'tsp' },
      { name: 'Asafoetida', amount: '0.25', unit: 'tsp' },
      { name: 'Saffron', amount: '1', unit: 'pinch' },
      { name: 'Ghee', amount: '3', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Brown lamb', detail: 'Sear lamb chunks in ghee until browned on all sides.' },
      { step: 2, title: 'Make spice paste', detail: 'Soak chilies, blend with spices and yogurt to make smooth paste.' },
      { step: 3, title: 'Cook curry', detail: 'Add spice paste to lamb. Cook on low heat 90 minutes until tender.' },
      { step: 4, title: 'Finish', detail: 'Sprinkle with saffron and garam masala. Rest 10 minutes before serving.' }
    ],
    alternativeIngredients: ['Goat instead of lamb', 'Beef for variation'],
    tags: ['indian', 'kashmiri', 'lamb', 'spicy']
  },
  {
    title: 'Chana Masala',
    description: 'Hearty chickpea curry with warming spices - a popular North Indian street food.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&h=600&fit=crop',
    cuisine: 'Indian',
    prepTime: 45,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Chickpeas', amount: '2', unit: 'cans' },
      { name: 'Onion', amount: '2', unit: 'large' },
      { name: 'Tomatoes', amount: '3', unit: 'medium' },
      { name: 'Ginger-garlic paste', amount: '2', unit: 'tbsp' },
      { name: 'Chana masala powder', amount: '2', unit: 'tbsp' },
      { name: 'Amchur', amount: '1', unit: 'tsp' },
      { name: 'Green chilies', amount: '2', unit: 'pieces' },
      { name: 'Cilantro', amount: '0.5', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Sauté aromatics', detail: 'Cook onions until deep golden. Add ginger-garlic paste.' },
      { step: 2, title: 'Add spices', detail: 'Add tomatoes and all spices. Cook until oil separates.' },
      { step: 3, title: 'Add chickpeas', detail: 'Add drained chickpeas and some liquid. Simmer 20 minutes.' },
      { step: 4, title: 'Garnish', detail: 'Top with fresh cilantro, ginger juliennes, and green chilies.' }
    ],
    alternativeIngredients: ['Dried chickpeas (soaked overnight)', 'Add potatoes for variation'],
    tags: ['indian', 'vegetarian', 'chickpeas', 'street food']
  },
  {
    title: 'Aloo Gobi',
    description: 'Simple and comforting cauliflower and potato curry with turmeric and cumin.',
    image: 'https://images.unsplash.com/photo-1626202158825-4b62c0db42c1?w=800&h=600&fit=crop',
    cuisine: 'Indian',
    prepTime: 35,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Cauliflower', amount: '1', unit: 'head' },
      { name: 'Potatoes', amount: '3', unit: 'medium' },
      { name: 'Onion', amount: '1', unit: 'large' },
      { name: 'Tomato', amount: '1', unit: 'medium' },
      { name: 'Turmeric', amount: '1', unit: 'tsp' },
      { name: 'Cumin seeds', amount: '1', unit: 'tsp' },
      { name: 'Garam masala', amount: '1', unit: 'tsp' },
      { name: 'Green chilies', amount: '2', unit: 'pieces' }
    ],
    instructions: [
      { step: 1, title: 'Prep vegetables', detail: 'Cut cauliflower into florets, potatoes into cubes.' },
      { step: 2, title: 'Temper spices', detail: 'Heat oil, add cumin seeds. When they splutter, add onions.' },
      { step: 3, title: 'Cook vegetables', detail: 'Add tomatoes, spices, then vegetables. Cover and cook 20 minutes.' },
      { step: 4, title: 'Finish', detail: 'Sprinkle garam masala and cilantro. Serve with roti or rice.' }
    ],
    alternativeIngredients: ['Add peas for aloo gobi matar', 'Use sweet potatoes'],
    tags: ['indian', 'vegetarian', 'vegan', 'simple']
  },
  // ADDITIONAL AMERICAN RECIPES
  {
    title: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheese, fresh toppings, and secret sauce on a toasted bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    cuisine: 'American',
    prepTime: 25,
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Ground beef', amount: '600', unit: 'g' },
      { name: 'Burger buns', amount: '4', unit: 'pieces' },
      { name: 'Cheddar cheese', amount: '4', unit: 'slices' },
      { name: 'Lettuce', amount: '4', unit: 'leaves' },
      { name: 'Tomato', amount: '1', unit: 'large' },
      { name: 'Onion', amount: '1', unit: 'medium' },
      { name: 'Pickles', amount: '8', unit: 'slices' },
      { name: 'Mayonnaise', amount: '0.25', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Form patties', detail: 'Gently form beef into 4 patties. Season generously with salt and pepper.' },
      { step: 2, title: 'Cook patties', detail: 'Grill or pan-fry over high heat 4 minutes per side for medium.' },
      { step: 3, title: 'Add cheese', detail: 'Top with cheese in last minute, cover to melt.' },
      { step: 4, title: 'Assemble', detail: 'Toast buns, spread sauce, layer lettuce, patty, tomato, onion, pickles.' }
    ],
    alternativeIngredients: ['Turkey or veggie patties', 'Swiss or blue cheese'],
    tags: ['american', 'burger', 'beef', 'grilled']
  },
  {
    title: 'New York Style Cheesecake',
    description: 'Rich and creamy cheesecake with graham cracker crust - the ultimate American dessert.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&h=600&fit=crop',
    cuisine: 'American',
    prepTime: 90,
    servings: 12,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Cream cheese', amount: '900', unit: 'g' },
      { name: 'Sugar', amount: '200', unit: 'g' },
      { name: 'Sour cream', amount: '1', unit: 'cup' },
      { name: 'Eggs', amount: '4', unit: 'large' },
      { name: 'Vanilla', amount: '2', unit: 'tsp' },
      { name: 'Graham crackers', amount: '200', unit: 'g' },
      { name: 'Butter', amount: '100', unit: 'g' },
      { name: 'Lemon zest', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Make crust', detail: 'Mix cracker crumbs with melted butter. Press into springform pan.' },
      { step: 2, title: 'Make filling', detail: 'Beat cream cheese until smooth. Add sugar, then eggs one at a time.' },
      { step: 3, title: 'Add flavorings', detail: 'Mix in sour cream, vanilla, and lemon zest until just combined.' },
      { step: 4, title: 'Bake', detail: 'Bake at 325°F in water bath for 60 minutes. Cool completely before chilling.' }
    ],
    alternativeIngredients: ['Chocolate crust', 'Fruit topping'],
    tags: ['american', 'dessert', 'cheesecake', 'baked']
  },
  {
    title: 'Buttermilk Fried Chicken',
    description: 'Crispy, juicy fried chicken with a flavorful buttermilk marinade and seasoned flour coating.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=600&fit=crop',
    cuisine: 'American',
    prepTime: 480,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken pieces', amount: '1.5', unit: 'kg' },
      { name: 'Buttermilk', amount: '2', unit: 'cups' },
      { name: 'Hot sauce', amount: '2', unit: 'tbsp' },
      { name: 'All-purpose flour', amount: '2', unit: 'cups' },
      { name: 'Paprika', amount: '2', unit: 'tbsp' },
      { name: 'Garlic powder', amount: '1', unit: 'tbsp' },
      { name: 'Cayenne', amount: '1', unit: 'tsp' },
      { name: 'Oil', amount: '4', unit: 'cups' }
    ],
    instructions: [
      { step: 1, title: 'Marinate', detail: 'Soak chicken in buttermilk and hot sauce overnight in refrigerator.' },
      { step: 2, title: 'Dredge', detail: 'Mix flour with spices. Dredge chicken, shaking off excess.' },
      { step: 3, title: 'Fry', detail: 'Fry in 350°F oil for 12-15 minutes until golden and internal temp is 165°F.' },
      { step: 4, title: 'Drain', detail: 'Drain on wire rack. Season with salt while hot.' }
    ],
    alternativeIngredients: ['Air fry for lighter version', 'Oven-baked option'],
    tags: ['american', 'fried chicken', 'southern', 'comfort food']
  },
  {
    title: 'Clam Chowder',
    description: 'Creamy New England-style clam chowder with tender clams, potatoes, and bacon.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
    cuisine: 'American',
    prepTime: 45,
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Clams', amount: '1', unit: 'kg' },
      { name: 'Bacon', amount: '200', unit: 'g' },
      { name: 'Potatoes', amount: '4', unit: 'medium' },
      { name: 'Heavy cream', amount: '2', unit: 'cups' },
      { name: 'Onion', amount: '1', unit: 'large' },
      { name: 'Celery', amount: '2', unit: 'stalks' },
      { name: 'Thyme', amount: '1', unit: 'tsp' },
      { name: 'Bay leaf', amount: '2', unit: 'leaves' }
    ],
    instructions: [
      { step: 1, title: 'Cook bacon', detail: 'Cook bacon until crispy. Remove, reserve fat.' },
      { step: 2, title: 'Sauté vegetables', detail: 'Cook onion and celery in bacon fat until soft.' },
      { step: 3, title: 'Add clams and potatoes', detail: 'Add clam juice, potatoes, and herbs. Simmer until potatoes are tender.' },
      { step: 4, title: 'Finish', detail: 'Add clams and cream. Heat through. Serve with bacon crumbles and oyster crackers.' }
    ],
    alternativeIngredients: ['Canned clams', 'Corn for variation'],
    tags: ['american', 'soup', 'seafood', 'new england']
  },
  {
    title: 'Mac and Cheese',
    description: 'Creamy, cheesy baked macaroni - the ultimate American comfort food.',
    image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=800&h=600&fit=crop',
    cuisine: 'American',
    prepTime: 50,
    servings: 6,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Elbow macaroni', amount: '400', unit: 'g' },
      { name: 'Cheddar cheese', amount: '400', unit: 'g' },
      { name: 'Milk', amount: '3', unit: 'cups' },
      { name: 'Butter', amount: '4', unit: 'tbsp' },
      { name: 'Flour', amount: '0.25', unit: 'cup' },
      { name: 'Mustard powder', amount: '1', unit: 'tsp' },
      { name: 'Breadcrumbs', amount: '0.5', unit: 'cup' },
      { name: 'Paprika', amount: '1', unit: 'tsp' }
    ],
    instructions: [
      { step: 1, title: 'Cook pasta', detail: 'Boil macaroni until al dente. Drain and set aside.' },
      { step: 2, title: 'Make cheese sauce', detail: 'Make roux with butter and flour. Whisk in milk until thickened. Add cheese.' },
      { step: 3, title: 'Combine', detail: 'Mix pasta with cheese sauce. Pour into baking dish.' },
      { step: 4, title: 'Bake', detail: 'Top with breadcrumbs and paprika. Bake at 350°F for 25 minutes until bubbly.' }
    ],
    alternativeIngredients: ['Add bacon or lobster', 'Mix of cheeses'],
    tags: ['american', 'pasta', 'comfort food', 'cheese']
  },
  // JAPANESE RECIPES
  {
    title: 'Tonkatsu',
    description: 'Crispy breaded pork cutlet served with tangy tonkatsu sauce and shredded cabbage.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 40,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Pork loin', amount: '2', unit: 'pieces' },
      { name: 'Panko breadcrumbs', amount: '2', unit: 'cups' },
      { name: 'Flour', amount: '0.5', unit: 'cup' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Cabbage', amount: '0.5', unit: 'head' },
      { name: 'Tonkatsu sauce', amount: '0.25', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Prepare pork', detail: 'Pound pork cutlets to even thickness. Season with salt and pepper.' },
      { step: 2, title: 'Dredge', detail: 'Dredge in flour, dip in beaten eggs, then coat thickly with panko.' },
      { step: 3, title: 'Fry', detail: 'Deep fry at 340°F for 3-4 minutes per side until golden and cooked through.' },
      { step: 4, title: 'Serve', detail: 'Slice into strips. Serve over shredded cabbage with tonkatsu sauce.' }
    ],
    alternativeIngredients: ['Chicken breast instead of pork', 'Regular breadcrumbs'],
    tags: ['japanese', 'pork', 'fried', 'breaded']
  },
  {
    title: 'Tempura',
    description: 'Light, crispy battered seafood and vegetables - the art of Japanese frying.',
    image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 30,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Shrimp', amount: '12', unit: 'pieces' },
      { name: 'Sweet potato', amount: '1', unit: 'medium' },
      { name: 'Eggplant', amount: '1', unit: 'small' },
      { name: 'Tempura flour', amount: '1', unit: 'cup' },
      { name: 'Ice water', amount: '1', unit: 'cup' },
      { name: 'Dashi', amount: '0.5', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Prep ingredients', detail: 'Peel and slice vegetables. Butterfly shrimp but leave tails on.' },
      { step: 2, title: 'Make batter', detail: 'Mix tempura flour with ice-cold water. Batter should be lumpy - do not overmix.' },
      { step: 3, title: 'Fry', detail: 'Dip ingredients in batter. Fry at 340°F until light golden and crispy, about 2-3 minutes.' },
      { step: 4, title: 'Serve', detail: 'Drain on rack. Serve immediately with tentsuyu dipping sauce made from dashi, soy, and mirin.' }
    ],
    alternativeIngredients: ['Asparagus and mushrooms', 'Squid and scallops'],
    tags: ['japanese', 'seafood', 'fried', 'light']
  },
  {
    title: 'Sukiyaki',
    description: 'Sweet-savory hot pot with thinly sliced beef, tofu, and vegetables cooked at the table.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 45,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Thin beef slices', amount: '500', unit: 'g' },
      { name: 'Tofu', amount: '1', unit: 'block' },
      { name: 'Napa cabbage', amount: '0.5', unit: 'head' },
      { name: 'Shiitake mushrooms', amount: '8', unit: 'pieces' },
      { name: 'Soy sauce', amount: '0.5', unit: 'cup' },
      { name: 'Mirin', amount: '0.5', unit: 'cup' },
      { name: 'Sugar', amount: '3', unit: 'tbsp' },
      { name: 'Eggs', amount: '4', unit: 'large' }
    ],
    instructions: [
      { step: 1, title: 'Prep ingredients', detail: 'Cut tofu, vegetables, and mushrooms into bite-sized pieces. Arrange on platter.' },
      { step: 2, title: 'Make warishita', detail: 'Mix soy sauce, mirin, sugar, and dashi. This is the sukiyaki broth.' },
      { step: 3, title: 'Cook at table', detail: 'Heat cast iron pot. Sauté some beef first. Add warishita and remaining ingredients.' },
      { step: 4, title: 'Dip in egg', detail: 'Dip cooked beef and vegetables into beaten raw egg before eating - this is traditional!' }
    ],
    alternativeIngredients: ['Chicken instead of beef', 'Udon noodles added at end'],
    tags: ['japanese', 'hot pot', 'beef', 'traditional']
  },
  {
    title: 'Okonomiyaki',
    description: 'Savory Japanese pancake loaded with cabbage, pork, and topped with special sauce and mayo.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 35,
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Cabbage', amount: '2', unit: 'cups' },
      { name: 'Flour', amount: '0.75', unit: 'cup' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Pork belly', amount: '100', unit: 'g' },
      { name: 'Dashi', amount: '0.75', unit: 'cup' },
      { name: 'Okonomiyaki sauce', amount: '3', unit: 'tbsp' },
      { name: 'Kewpie mayo', amount: '2', unit: 'tbsp' },
      { name: 'Bonito flakes', amount: '1', unit: 'handful' }
    ],
    instructions: [
      { step: 1, title: 'Make batter', detail: 'Mix flour and dashi. Add eggs and shredded cabbage. Mix until just combined.' },
      { step: 2, title: 'Cook', detail: 'Pour half batter onto hot oiled griddle. Top with pork slices. Cook 4 minutes, flip, cook 4 more.' },
      { step: 3, title: 'Top', detail: 'Drizzle with okonomiyaki sauce and Kewpie mayo in decorative pattern.' },
      { step: 4, title: 'Garnish', detail: 'Top with bonito flakes (they will dance from the heat!) and aonori seaweed.' }
    ],
    alternativeIngredients: ['Shrimp instead of pork', 'Gluten-free flour blend'],
    tags: ['japanese', 'pancake', 'savory', 'street food']
  },
  {
    title: 'Gyoza',
    description: 'Pan-fried Japanese dumplings with juicy pork filling and crispy bottoms.',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 60,
    servings: 24,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Ground pork', amount: '300', unit: 'g' },
      { name: 'Gyoza wrappers', amount: '24', unit: 'pieces' },
      { name: 'Cabbage', amount: '1', unit: 'cup' },
      { name: 'Garlic chives', amount: '0.5', unit: 'cup' },
      { name: 'Soy sauce', amount: '2', unit: 'tbsp' },
      { name: 'Sesame oil', amount: '1', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Make filling', detail: 'Mix ground pork with minced cabbage, chives, ginger, soy sauce, and sesame oil.' },
      { step: 2, title: 'Wrap', detail: 'Place filling in center of wrapper. Moisten edges, fold in half, and pleat one side.' },
      { step: 3, title: 'Pan fry', detail: 'Heat oil in skillet. Arrange gyoza flat side down. Cook until bottoms are golden.' },
      { step: 4, title: 'Steam', detail: 'Add 1/4 cup water and immediately cover. Steam 3-4 minutes until cooked through. Uncover and crisp bottoms again.' }
    ],
    alternativeIngredients: ['Chicken or vegetable filling', 'Homemade wrappers'],
    tags: ['japanese', 'dumplings', 'pork', 'pan-fried']
  },
  {
    title: 'Unagi Don',
    description: 'Grilled eel glazed with sweet soy sauce over steamed rice - a Japanese delicacy.',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 25,
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Unagi fillets', amount: '2', unit: 'pieces' },
      { name: 'Sushi rice', amount: '2', unit: 'cups' },
      { name: 'Unagi sauce', amount: '0.25', unit: 'cup' },
      { name: 'Cucumber', amount: '0.5', unit: 'piece' },
      { name: 'Sansho pepper', amount: '1', unit: 'tsp' },
      { name: 'Pickled ginger', amount: '2', unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, title: 'Cook rice', detail: 'Prepare sushi rice with seasoned vinegar. Keep warm.' },
      { step: 2, title: 'Grill unagi', detail: 'Brush unagi with sauce. Grill or broil for 3-4 minutes until glazed and heated through.' },
      { step: 3, title: 'Assemble', detail: 'Pack rice into bowls. Arrange unagi on top. Brush with more sauce.' },
      { step: 4, title: 'Garnish', detail: 'Sprinkle with sansho pepper (Japanese pepper). Serve with pickled ginger and cucumber.' }
    ],
    alternativeIngredients: ['Teriyaki salmon instead of unagi', 'Brown rice instead of white'],
    tags: ['japanese', 'eel', 'rice bowl', 'delicacy']
  },
  {
    title: 'Matcha Latte',
    description: 'Creamy green tea latte with frothy milk and authentic Japanese matcha.',
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 10,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Matcha powder', amount: '1.5', unit: 'tsp' },
      { name: 'Hot water', amount: '2', unit: 'tbsp' },
      { name: 'Milk', amount: '1', unit: 'cup' },
      { name: 'Honey', amount: '1', unit: 'tsp' }
    ],
    instructions: [
      { step: 1, title: 'Sift matcha', detail: 'Sift matcha powder into bowl to remove lumps. This ensures smooth texture.' },
      { step: 2, title: 'Whisk', detail: 'Add hot water (not boiling). Whisk vigorously in M-shape until frothy.' },
      { step: 3, title: 'Froth milk', detail: 'Heat and froth milk. Pour over matcha, holding back foam with spoon.' },
      { step: 4, title: 'Finish', detail: 'Spoon foam on top. Sweeten with honey if desired. Serve immediately.' }
    ],
    alternativeIngredients: ['Oat milk instead of dairy', 'Maple syrup instead of honey'],
    tags: ['japanese', 'matcha', 'latte', 'beverage']
  },
  {
    title: 'Yakitori',
    description: 'Grilled chicken skewers with sweet-savory tare sauce - perfect izakaya food.',
    image: 'https://images.unsplash.com/photo-1529563021894-ef469d22f271?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 45,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Chicken thighs', amount: '500', unit: 'g' },
      { name: 'Green onions', amount: '4', unit: 'stalks' },
      { name: 'Soy sauce', amount: '0.5', unit: 'cup' },
      { name: 'Mirin', amount: '0.5', unit: 'cup' },
      { name: 'Sake', amount: '0.25', unit: 'cup' },
      { name: 'Sugar', amount: '3', unit: 'tbsp' },
      { name: 'Bamboo skewers', amount: '8', unit: 'pieces' }
    ],
    instructions: [
      { step: 1, title: 'Make tare sauce', detail: 'Simmer soy sauce, mirin, sake, and sugar until reduced by half and syrupy. Cool.' },
      { step: 2, title: 'Prep chicken', detail: 'Cut chicken into bite-sized pieces. Cut green onions into 1-inch lengths.' },
      { step: 3, title: 'Skewer', detail: 'Alternate chicken and green onions on soaked bamboo skewers.' },
      { step: 4, title: 'Grill', detail: 'Grill over medium heat, turning and basting with tare sauce, until cooked through and glazed.' }
    ],
    alternativeIngredients: ['Chicken breast instead of thighs', 'Metal skewers instead of bamboo'],
    tags: ['japanese', 'yakitori', 'grilled', 'skewers']
  },
  {
    title: 'Onigiri',
    description: 'Japanese rice balls filled with savory ingredients and wrapped in nori - perfect for bento.',
    image: 'https://images.unsplash.com/photo-1626082927829-5a7c047bcf53?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 30,
    servings: 6,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Sushi rice', amount: '2', unit: 'cups' },
      { name: 'Nori sheets', amount: '3', unit: 'pieces' },
      { name: 'Salt', amount: '1', unit: 'tsp' },
      { name: 'Salmon filling', amount: '0.5', unit: 'cup' },
      { name: 'Umeboshi', amount: '3', unit: 'pieces' },
      { name: 'Tuna mayo', amount: '0.5', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Cook rice', detail: 'Cook sushi rice and season with rice vinegar while warm. Let cool slightly.' },
      { step: 2, title: 'Wet hands', detail: 'Keep a bowl of salted water nearby. Wet hands before shaping to prevent sticking.' },
      { step: 3, title: 'Shape onigiri', detail: 'Take portion of rice, make indent, add filling, close and shape into triangle.' },
      { step: 4, title: 'Wrap', detail: 'Wrap bottom with strip of nori just before serving to keep it crispy.' }
    ],
    alternativeIngredients: ['Pickled plum filling', 'Grilled salted salmon'],
    tags: ['japanese', 'rice ball', 'bento', 'portable']
  },
  {
    title: 'Shabu Shabu',
    description: 'Japanese hot pot with thinly sliced beef and vegetables swished in dashi broth.',
    image: 'https://images.unsplash.com/photo-1594970426224-a3862e7d74d7?w=800&h=600&fit=crop',
    cuisine: 'Japanese',
    prepTime: 30,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Thin beef slices', amount: '500', unit: 'g' },
      { name: 'Napa cabbage', amount: '0.5', unit: 'head' },
      { name: 'Enoki mushrooms', amount: '2', unit: 'packs' },
      { name: 'Tofu', amount: '1', unit: 'block' },
      { name: 'Dashi', amount: '6', unit: 'cups' },
      { name: 'Ponzu sauce', amount: '0.5', unit: 'cup' },
      { name: 'Goma dare', amount: '0.5', unit: 'cup' }
    ],
    instructions: [
      { step: 1, title: 'Prep ingredients', detail: 'Arrange sliced beef and vegetables on platters. Cut tofu into cubes.' },
      { step: 2, title: 'Heat broth', detail: 'Heat dashi in hot pot at the table. Add kombu for extra umami.' },
      { step: 3, title: 'Swish and cook', detail: 'Swish beef slices in hot broth for 10-20 seconds until just cooked. Cook vegetables until tender.' },
      { step: 4, title: 'Dip and eat', detail: 'Dip cooked ingredients in ponzu or sesame sauce. Add rice or noodles at the end.' }
    ],
    alternativeIngredients: ['Pork slices instead of beef', 'Chicken meatballs'],
    tags: ['japanese', 'hot pot', 'beef', 'interactive']
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
      
      // Assign Philly Cheese Steak specifically to James Wilson (index 3)
      let user;
      if (recipeData.title === 'Philly Cheese Steak') {
        user = createdUsers[3]; // James Wilson
      } else {
        user = createdUsers[i % createdUsers.length];
      }
      
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
