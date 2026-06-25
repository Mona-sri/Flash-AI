
import { API_BASE } from '../config';
const BACKEND_URL = `${API_BASE}/generate-flashcards`;
/**
 * Generate flashcards from text via your backend.
 * @param {string} text
 * @param {'easy'|'medium'|'hard'} difficulty
 * @param {number} count
 * @returns {Promise<{id,question,answer}[]>}
 */
export async function generateFlashcards(formData) {
  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    body: formData, 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error('Authorization issue on the server.');
    if (response.status === 429) throw new Error('Rate limit hit. Please wait and try again.');
    throw new Error(errorData.error || 'Failed to generate flashcards');
  }

  return await response.json();
}
