// Sample dictionary mapping keywords to categories
const categories = {
  'Amazon Q': ['Q', 'refactor', 'describe', 'summary', 'summarize', 'explain', 'explaining', 'explainer', 'comment', 'transform', 'transformation', 'migrate', 'modern', 'modernize', 'modernizing', 'translate', 'translation', 'migration'],
  'CodeWhisperer': ['region', 'language support', 'lang support', 'security scanning', 'PII', 'support for', 'file context', 'HIPPA', 'SOC', 'PCI', 'compliance', 'customization', 'whisperer']  
};
// Read CSV 
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const coolPath = path.join(__dirname, '../data.csv');
const results = [];

fs.createReadStream(coolPath)
  .pipe(csv())
  .on('data', (row) => {
    //console.log(row['Feature Request Title']);
    //console.log(row['Feature Request Details']);
    let string_check = row['Feature Request Title'] + ' ' + row['Feature Request Details'];
    //console.log(string_check);
    // Iterate each row
    let category;

    // Check string against keywords
    category = getCategory(string_check);

    // If no match, default category
    if(!category) {
      category = 'CodeWhisperer';
    }

    // Add category to row
    row.Category = category;
    let push_row = JSON.stringify(row);
    // Push row to results
    results.push(JSON.parse(push_row));
  })
  .on('end', () => {

    // Write results to new CSV
    const csvWriter = createCsvWriter({
      path: '../output.csv',
      header: [
        {id: 'Created Date', title: 'Created Date'},
        {id: 'Created By: Full Name', title: 'Created By'},
        {id: 'Feature Request Title', title: 'Feature Request Title'},
        {id: 'Feature Request Details', title: 'Feature Request Details'},
        {id: 'Customer Influence Count', title: 'Customer Influence Count'},
        {id: 'Last Activity Date', title: 'Last Activity Date'},
        {id: 'Last Modified By: Full Name', title: 'Last Modified By'},
        {id: 'Category', title: 'Category'}
      ]
    });

    //console.log(results);
    csvWriter.writeRecords(results)
  .then(() => console.log('CSV file written successfully'))
  .catch((err) => console.error('Error writing CSV file:', err));
  });

/**
Here's how the updated function works:
The function starts by splitting the input text into an array of words using text.split(' ').
It initializes an empty object categoryOccurrences to keep track of the number of occurrences of each category.
It loops through each category in the categories object and each keyword in that category's array.
If a keyword is found in the words array, it increments the count for that category in the categoryOccurrences object. If the category doesn't exist in the object yet, it initializes the count to 1.
After iterating through all categories and keywords, the function initializes two variables: highestCategory and highestOccurrence. highestCategory is set to 'CodeWhisperer' (a default value), and highestOccurrence is set to 0.
It then loops through the categoryOccurrences object and updates highestCategory and highestOccurrence with the category that has the highest occurrence count.
Finally, the function returns highestCategory.
*/
  function getCategory(text) {
    const words = text.toLowerCase().split(' ');
    const categoryOccurrences = {};
  
    for (let category in categories) {
      for (let keyword of categories[category]) {
        const lowercasekeyword = keyword.toLowerCase();
        // Using a regular expression with word boundaries
        const regex = new RegExp(`\\b${lowercasekeyword}\\b`, "gi");
        const matches = text.match(regex);
        console.log(words);
        if (matches) {
          categoryOccurrences[category] = (categoryOccurrences[category] || 0) + 1;
        }
      }
    }
  
    let highestCategory = 'CodeWhisperer';
    let highestOccurrence = 0;
  
    for (let category in categoryOccurrences) {
      if (categoryOccurrences[category] > highestOccurrence) {
        highestCategory = category;
        highestOccurrence = categoryOccurrences[category];
      }
    }
  
    return highestCategory;
  }

// // Example usage
// const category = getCategory('explain code flow', categories);
// console.log(category); // Outputs "Documentation"
