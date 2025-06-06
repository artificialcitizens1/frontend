import type { CandidateParameters, PoliticalStanding } from '../types/candidate';

/**
 * Calculates the political standing based on candidate parameters
 * 
 * Algorithm explanation:
 * - X-axis (Left-Right):
 *   - Higher charisma and authenticity tend towards right
 *   - Higher integrity tends towards left
 *   - Aggressive communication style shifts right
 *   - More media interactions shift right
 * 
 * - Y-axis (Libertarian-Authoritarian):
 *   - Higher temper tends authoritarian
 *   - Higher integrity tends libertarian
 *   - Aggressive communication shifts authoritarian
 *   - More media interactions shift authoritarian
 */
export const calculatePoliticalStanding = (params: CandidateParameters): PoliticalStanding => {
  let x = 0; // Left (-1) to Right (1)
  let y = 0; // Libertarian (-1) to Authoritarian (1)

  // Base weights for parameters
  const weights = {
    charisma: 0.3,
    temper: 0.25,
    integrity: 0.25,
    authenticity: 0.2
  };

  // Calculate X-axis (Left-Right)
  x += (params.charisma - 0.5) * weights.charisma * 2; // Charisma pushes right
  x += (params.authenticity - 0.5) * weights.authenticity * 2; // Authenticity pushes right
  x -= (params.integrity - 0.5) * weights.integrity * 2; // Integrity pushes left

  // Communication style effect on X-axis
  if (params.communicationStyle === 'Aggressive') x += 0.2;
  if (params.communicationStyle === 'Trendy') x += 0.1;

  // Media interactions effect on X-axis
  if (params.mediaInteractions === 'Many') x += 0.2;
  if (params.mediaInteractions === 'Few') x += 0.1;

  // Calculate Y-axis (Libertarian-Authoritarian)
  y += (params.temper - 0.5) * weights.temper * 2; // Temper pushes authoritarian
  y -= (params.integrity - 0.5) * weights.integrity * 2; // Integrity pushes libertarian
  y -= (params.authenticity - 0.5) * weights.authenticity; // Authenticity slightly pushes libertarian

  // Communication style effect on Y-axis
  if (params.communicationStyle === 'Aggressive') y += 0.2;
  if (params.communicationStyle === 'Calm') y -= 0.2;

  // Media interactions effect on Y-axis
  if (params.mediaInteractions === 'Many') y += 0.15;
  if (params.mediaInteractions === 'None') y -= 0.15;

  // Ensure values stay within -1 to 1 range
  x = Math.max(-1, Math.min(1, x));
  y = Math.max(-1, Math.min(1, y));

  return { x, y };
}; 