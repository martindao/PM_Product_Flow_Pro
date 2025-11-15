// Simple script to demonstrate Task Master integration
const { generateExpertDocument, saveForTaskMaster } = require('./dist/utils/aiUtils');
const { setupTaskMasterIntegration } = require('./dist/utils/fileUtils');
const { readTemplate } = require('./dist/utils/fileUtils');
const { experts } = require('./dist/experts');
const fs = require('fs').promises;
const path = require('path');

async function generateTaskMasterFiles() {
  try {
    console.log('Generating Task Master integration files...');
    
    // Get the Product Manager expert
    const expert = experts.productManager;
    if (!expert) {
      throw new Error('Product Manager expert not found');
    }
    
    // Read the template
    console.log('Reading template...');
    const template = await readTemplate(expert.templatePath);
    
    // Sample project details
    const projectDetails = `
      I want to build a recipe app that helps users find recipes based on ingredients they have at home.
      Target users are home cooks who want to reduce food waste and save money by using what they already have.
      Key features should include ingredient search, recipe display, saving favorites, and generating shopping lists.
    `;
    
    // Generate the document
    console.log('Generating document with OpenRouter API...');
    const document = await generateExpertDocument('productManager', template, projectDetails);
    
    // Save the document to a file
    const filename = `${expert.outputFormat.replace(/\\s+/g, '_').toLowerCase()}.md`;
    const filePath = path.join(process.cwd(), filename);
    await fs.writeFile(filePath, document, 'utf8');
    console.log(`Document saved to ${filePath}`);
    
    // Save for Task Master
    console.log('Saving for Task Master...');
    const tmPath = await saveForTaskMaster(document);
    console.log(`Document saved for Task Master at ${tmPath}`);
    
    // Setup Task Master integration
    console.log('Setting up Task Master integration...');
    await setupTaskMasterIntegration();
    console.log('Task Master integration setup complete');
    
    console.log('\nTask Master integration files generated successfully!');
    console.log('\nYou can now use Task Master to parse the PRD with:');
    console.log('"Can you parse the PRD at scripts/prd.txt and generate tasks?"');
    
  } catch (error) {
    console.error('Error generating Task Master files:', error);
  }
}

// Run the function
generateTaskMasterFiles();
