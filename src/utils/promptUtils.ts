import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function getExpertResponse(systemPrompt: string, userInput: string) {
  try {
    const response = await anthropic.messages.create({
      model: process.env.MODEL || 'claude-3-sonnet-20240229',
      max_tokens: parseInt(process.env.MAX_TOKENS || '4000'),
      temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
      system: systemPrompt,
      messages: [
        { role: 'user', content: userInput }
      ]
    });

    // Handle different content block types
    const content = response.content[0];
    if ('text' in content) {
      return content.text || '';
    } else {
      console.error('Unexpected content format:', content);
      return 'Error: Unexpected response format from Claude API';
    }
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

export async function generateDocument(systemPrompt: string, template: string, userInput: string) {
  const enhancedPrompt = `${systemPrompt}\n\nPlease use the following template structure for your response:\n\n${template}\n\nBased on the user's input, create a complete, well-structured document. Format your response using Markdown with clear sections and subsections.`;

  try {
    const response = await anthropic.messages.create({
      model: process.env.MODEL || 'claude-3-sonnet-20240229',
      max_tokens: parseInt(process.env.MAX_TOKENS || '8000'),
      temperature: parseFloat(process.env.TEMPERATURE || '0.5'),
      system: enhancedPrompt,
      messages: [
        { role: 'user', content: userInput }
      ]
    });

    // Handle different content block types
    const content = response.content[0];
    if ('text' in content) {
      return content.text || '';
    } else {
      console.error('Unexpected content format:', content);
      return 'Error: Unexpected response format from Claude API';
    }
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}