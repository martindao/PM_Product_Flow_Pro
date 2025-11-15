import fs from 'fs/promises';
import path from 'path';

export async function saveDocument(content: string, filename: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), filename);
    await fs.writeFile(filePath, content, 'utf8');
    return filePath;
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
}

/**
 * Save or update the PRD file with expert content
 * This function saves all expert content to the same PRD file,
 * updating it as the workflow progresses through different experts
 */
export async function saveExpertDocument(content: string, expertType: string): Promise<string> {
  try {
    // Create scripts directory if it doesn't exist
    const scriptsDir = path.join(process.cwd(), 'scripts');
    try {
      await fs.mkdir(scriptsDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    // Always save to prd.txt, but with appropriate section headers based on expert type
    const filePath = path.join(scriptsDir, 'prd.txt');

    // Check if file exists
    let existingContent = '';
    try {
      existingContent = await fs.readFile(filePath, 'utf8');
    } catch (err) {
      // File doesn't exist yet, which is fine
    }

    // Add appropriate section headers based on expert type
    let updatedContent = '';
    if (expertType === 'productManager') {
      // For Product Manager, just use the content directly as the base PRD
      updatedContent = content;
    } else {
      // For other experts, append their content to the existing PRD with clear section headers
      const sectionTitle = expertType === 'uxDesigner' ?
        '# UX DESIGN SPECIFICATIONS' :
        '# TECHNICAL ARCHITECTURE SPECIFICATIONS';

      // If there's existing content, add a separator
      if (existingContent) {
        updatedContent = `${existingContent}\n\n---\n\n${sectionTitle}\n\n${content}`;
      } else {
        // If no existing content (shouldn't happen), just add the section
        updatedContent = `${sectionTitle}\n\n${content}`;
      }
    }

    // Write the updated content
    await fs.writeFile(filePath, updatedContent, 'utf8');

    // Also save a copy with the expert type for reference (optional)
    const expertFilename = `${expertType.toLowerCase()}_contribution.md`;
    const expertFilePath = path.join(process.cwd(), expertFilename);
    await fs.writeFile(expertFilePath, content, 'utf8');

    return filePath;
  } catch (error) {
    console.error('Error saving expert document:', error);
    throw error;
  }
}

export async function readTemplate(templatePath: string): Promise<string> {
  try {
    const fullPath = path.join(__dirname, '..', '..', templatePath);
    return await fs.readFile(fullPath, 'utf8');
  } catch (error) {
    console.error('Error reading template:', error);

    // Fallback to default templates if file not found
    if (templatePath.includes('prd-template.md')) {
      return `# Product Requirements Document\n\n## Product Overview\n[Overview goes here]\n\n## Problem Statement\n[Problem statement goes here]`;
    } else if (templatePath.includes('ux-doc-template.md')) {
      return `# UX Design Document\n\n## User Personas\n[User personas go here]`;
    } else if (templatePath.includes('software-spec-template.md')) {
      return `# Software Specification\n\n## System Architecture Overview\n[System architecture overview goes here]`;
    }

    throw error;
  }
}

// Create Task Master integration files
export async function setupTaskMasterIntegration(): Promise<void> {
  try {
    // Create .cursor directory and rules if it doesn't exist
    const cursorDir = path.join(process.cwd(), '.cursor', 'rules');
    await fs.mkdir(cursorDir, { recursive: true });

    // Create dev_workflow.mdc file for Cursor integration
    const devWorkflowContent = `# Task Master Development Workflow

## Overview
- Task Master is an AI-driven development tool that helps organize and manage tasks
- It integrates with Claude and Cursor to provide a seamless development experience
- This workflow explains how to use Task Master effectively

## Commands
- Use \`parse-prd\` to generate tasks from a PRD
- Use \`list\` to see all tasks
- Use \`next\` to get the next task to work on
- Use \`generate\` to generate code for a specific task

## Integration with AI Expert Workflow
- AI Expert Workflow generates comprehensive PRDs
- These PRDs can be parsed by Task Master to create tasks
- The workflow creates a seamless planning-to-implementation pipeline

## Examples
To parse a PRD:
\`\`\`
Can you parse the PRD at scripts/prd.txt and generate tasks?
\`\`\`

To get the next task:
\`\`\`
What's the next task I should work on?
\`\`\`
`;

    await fs.writeFile(path.join(cursorDir, 'dev_workflow.mdc'), devWorkflowContent, 'utf8');

    return;
  } catch (error) {
    console.error('Error setting up Task Master integration:', error);
    throw error;
  }
}