#!/usr/bin/env node

/**
 * Script to merge all files from a selected folder into a single file
 * Usage: node merge-files.js [folder-path] [output-file]
 * Default: folder='src', output='./tmp/merged-files.txt'
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get all files recursively from a directory
 * @param {string} dirPath - Directory path to scan
 * @param {string[]} fileList - Array to collect file paths
 * @returns {string[]} Array of file paths
 */
function getAllFiles(dirPath, fileList = []) {
  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Skip common directories that shouldn't be included
        if (!['node_modules', '.git', 'dist', 'build', '.next', '.nuxt'].includes(file)) {
          getAllFiles(filePath, fileList);
        }
      } else {
        // Only include relevant file types
        const ext = path.extname(file).toLowerCase();
        if (['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss', '.html', '.md', '.txt', '.mts', '.cts'].includes(ext)) {
          fileList.push(filePath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }

  return fileList;
}

/**
 * Read file content safely
 * @param {string} filePath - Path to the file
 * @returns {string} File content or error message
 */
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
}

/**
 * Main function to merge files
 */
function mergeFiles() {
  // Get command line arguments
  const folderPath = process.argv[2] || 'src';
  const outputFile = process.argv[3] || './tmp/merged-files.txt';

  console.log(`Merging files from: ${folderPath}`);
  console.log(`Output file: ${outputFile}`);

  // Ensure tmp directory exists
  const tmpDir = path.dirname(outputFile);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
    console.log(`Created directory: ${tmpDir}`);
  }

  // Get all files
  const files = getAllFiles(folderPath);
  console.log(`Found ${files.length} files to merge`);

  if (files.length === 0) {
    console.log('No files found to merge');
    return;
  }

  // Sort files for consistent output
  files.sort();

  // Merge files
  let mergedContent = `MERGED FILES FROM: ${folderPath}\n`;
  mergedContent += `Generated on: ${new Date().toISOString()}\n`;
  mergedContent += `Total files: ${files.length}\n\n`;
  mergedContent += '='.repeat(80) + '\n\n';

  for (const filePath of files) {
    const relativePath = path.relative(process.cwd(), filePath);
    const content = readFileContent(filePath);

    mergedContent += `FILE: ${relativePath}\n`;
    mergedContent += '-'.repeat(60) + '\n';
    mergedContent += content;
    mergedContent += '\n\n' + '='.repeat(80) + '\n\n';
  }

  // Write merged content to file
  try {
    fs.writeFileSync(outputFile, mergedContent, 'utf8');
    console.log(`✅ Successfully merged ${files.length} files into: ${outputFile}`);
    console.log(`Output size: ${(mergedContent.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('Error writing merged file:', error.message);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  mergeFiles();
}

export { mergeFiles, getAllFiles, readFileContent };