'use server';

/**
 * @fileOverview Generates an image based on a text prompt.
 *
 * - generateImageFromPrompt - A function that generates an image based on a prompt.
 * - GenerateImageFromPromptInput - The input type for the generateImageFromPrompt function.
 * - GenerateImageFromPromptOutput - The return type for the generateImageFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageFromPromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to use to generate the image.'),
});
export type GenerateImageFromPromptInput = z.infer<typeof GenerateImageFromPromptInputSchema>;

const GenerateImageFromPromptOutputSchema = z.object({
  image: z.string().describe('The generated image as a data URI.'),
});
export type GenerateImageFromPromptOutput = z.infer<typeof GenerateImageFromPromptOutputSchema>;

export async function generateImageFromPrompt(input: GenerateImageFromPromptInput): Promise<GenerateImageFromPromptOutput> {
  return generateImageFromPromptFlow(input);
}

const generateImagePrompt = ai.definePrompt({
  name: 'generateImagePrompt',
  input: {schema: GenerateImageFromPromptInputSchema},
  output: {schema: GenerateImageFromPromptOutputSchema},
  prompt: `Generate an image based on the following prompt: {{{prompt}}}`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateImageFromPromptFlow = ai.defineFlow(
  {
    name: 'generateImageFromPromptFlow',
    inputSchema: GenerateImageFromPromptInputSchema,
    outputSchema: GenerateImageFromPromptOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {image: media.url!};
  }
);
