import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  Camera, 
  Clock, 
  Users, 
  ChefHat,
  ArrowRight,
  Check,
  Save,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../context/RecipeContext';
import { cuisineCategories } from '../data/mockData';

const DRAFT_KEY = 'flavora_recipe_draft';

export default function CreateRecipe() {
  const { user } = useAuth();
  const { addRecipe } = useRecipes();
  const navigate = useNavigate();
  
  // Load draft from localStorage on initial render
  const loadDraft = () => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  };

  const initialFormData = {
    title: '',
    description: '',
    cuisine: 'Italian',
    prepTime: '',
    servings: '',
    image: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: [{ title: '', detail: '' }],
    alternativeIngredients: [],
  };

  const draft = loadDraft();
  const [formData, setFormData] = useState(draft || initialFormData);
  const [newAltIngredient, setNewAltIngredient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState(draft ? new Date() : null);
  const [showDraftLoaded, setShowDraftLoaded] = useState(!!draft);

  // Auto-save to localStorage whenever formData changes
  useEffect(() => {
    const hasContent = formData.title || formData.description || formData.ingredients.length > 1 || formData.instructions.length > 1;
    if (hasContent) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      setLastSaved(new Date());
    }
  }, [formData]);

  // Clear draft when component unmounts if recipe was successfully posted
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
  }, []);

  const handleAddIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }]
    }));
  };

  const handleRemoveIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const handleAddInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, { title: '', detail: '' }]
    }));
  };

  const handleRemoveInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleInstructionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => 
        i === index ? { ...inst, [field]: value } : inst
      )
    }));
  };

  const handleAddAltIngredient = () => {
    if (newAltIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        alternativeIngredients: [...prev.alternativeIngredients, newAltIngredient.trim()]
      }));
      setNewAltIngredient('');
    }
  };

  const handleRemoveAltIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      alternativeIngredients: prev.alternativeIngredients.filter((_, i) => i !== index)
    }));
  };

  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setFormData(initialFormData);
    setLastSaved(null);
    setShowDraftLoaded(false);
  };

  const handleSaveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    setLastSaved(new Date());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const recipe = addRecipe({
        ...formData,
        userId: user.id,
        prepTime: parseInt(formData.prepTime) || 30,
        servings: parseInt(formData.servings) || 4,
        image: formData.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop',
      });
      
      // Clear draft after successful submission
      clearDraft();
      
      navigate(`/recipe/${recipe.id}`);
    }, 1000);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.prepTime && formData.servings;
      case 2:
        return formData.ingredients.every(ing => ing.name && ing.amount);
      case 3:
        return formData.instructions.every(inst => inst.title && inst.detail);
      default:
        return true;
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Draft Loaded Notification */}
        <AnimatePresence>
          {showDraftLoaded && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Save className="w-5 h-5 text-blue-500" />
                <span className="text-blue-700 dark:text-blue-400">
                  Draft loaded from your last session
                </span>
              </div>
              <button
                onClick={handleClearDraft}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <RotateCcw className="w-4 h-4" />
                Start fresh
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-500/20 rounded-xl">
                <ChefHat className="w-6 h-6 text-orange-500" />
              </div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
                Create Recipe
              </h1>
            </div>
            {lastSaved && (
              <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                <Save className="w-4 h-4" />
                <span>Saved {formatLastSaved()}</span>
              </div>
            )}
          </div>
          <p className="text-stone-500 dark:text-stone-400">
            Share your culinary masterpiece with the world
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s
                    ? 'bg-orange-500 text-white'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 rounded-full transition-all ${
                    step > s
                      ? 'bg-orange-500'
                      : 'bg-stone-200 dark:bg-stone-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl p-6 md:p-8"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  Basic Information
                </h2>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Recipe Image URL
                  </label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                    />
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Leave empty for a default image
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Recipe Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Creamy Mushroom Risotto"
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your recipe..."
                    rows={3}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 resize-none"
                    required
                  />
                </div>

                {/* Cuisine */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Cuisine Type *
                  </label>
                  <select
                    value={formData.cuisine}
                    onChange={(e) => setFormData(prev => ({ ...prev, cuisine: e.target.value }))}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                  >
                    {cuisineCategories.filter(c => c !== 'All').map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>

                {/* Prep Time & Servings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                      Prep Time (min) *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="number"
                        value={formData.prepTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, prepTime: e.target.value }))}
                        placeholder="30"
                        min="1"
                        className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                      Servings *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="number"
                        value={formData.servings}
                        onChange={(e) => setFormData(prev => ({ ...prev, servings: e.target.value }))}
                        placeholder="4"
                        min="1"
                        className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  Ingredients
                </h2>

                <div className="space-y-3">
                  {formData.ingredients.map((ingredient, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        placeholder="Ingredient name"
                        className="flex-1 px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                        required
                      />
                      <input
                        type="text"
                        value={ingredient.amount}
                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                        placeholder="Amount"
                        className="w-24 px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                        required
                      />
                      <input
                        type="text"
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                        placeholder="Unit"
                        className="w-24 px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                      />
                      {formData.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="flex items-center gap-2 px-4 py-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Ingredient
                </button>

                {/* Alternative Ingredients */}
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Alternative Ingredients (optional)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newAltIngredient}
                      onChange={(e) => setNewAltIngredient(e.target.value)}
                      placeholder="e.g., Coconut milk for creaminess"
                      className="flex-1 px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAltIngredient())}
                    />
                    <button
                      type="button"
                      onClick={handleAddAltIngredient}
                      className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.alternativeIngredients.map((alt, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 rounded-full text-sm"
                      >
                        {alt}
                        <button
                          type="button"
                          onClick={() => handleRemoveAltIngredient(index)}
                          className="hover:text-orange-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  Instructions
                </h2>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Add detailed steps with a title and full description for each.
                </p>

                <div className="space-y-6">
                  {formData.instructions.map((instruction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={instruction.title}
                          onChange={(e) => handleInstructionChange(index, 'title', e.target.value)}
                          placeholder="Step title (e.g., Prepare the marinade)"
                          className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                          required
                        />
                        <textarea
                          value={instruction.detail}
                          onChange={(e) => handleInstructionChange(index, 'detail', e.target.value)}
                          placeholder="Detailed instructions for this step..."
                          rows={3}
                          className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 resize-none"
                          required
                        />
                      </div>
                      {formData.instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveInstruction(index)}
                          className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors self-start"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddInstruction}
                  className="flex items-center gap-2 px-4 py-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Step
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white font-medium rounded-xl transition-colors"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <motion.button
                type="submit"
                disabled={isSubmitting || !isStepValid()}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-70 text-white font-medium rounded-xl shadow-lg shadow-orange-500/25 transition-all"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Post Recipe
                    <Check className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
}
