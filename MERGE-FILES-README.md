# File Merger Script

A Node.js script to merge all files from a selected folder into a single file for easy sharing, backup, or analysis.

## Features

- **Recursive Directory Traversal**: Scans entire directory trees
- **File Type Filtering**: Only includes relevant file types (JS, TS, CSS, SCSS, HTML, MD, JSON, etc.)
- **Smart Exclusions**: Automatically skips common build/dependency directories
- **Organized Output**: Clear file separators with paths and content
- **ES Module Support**: Works with modern Node.js projects
- **Error Handling**: Graceful handling of read errors

## Usage

### Basic Usage

```bash
# Merge src folder (default)
node merge-files.js

# Merge specific folder
node merge-files.js src

# Merge with custom output file
node merge-files.js src ./backup/project-files.txt

# Merge netlify folder
node merge-files.js netlify
```

### Command Line Arguments

```
node merge-files.js [folder-path] [output-file]
```

- `folder-path`: Directory to scan (default: 'src')
- `output-file`: Output file path (default: './tmp/merged-files.txt')

## Output Format

The merged file includes:

1. **Header Information**:
   - Source folder path
   - Generation timestamp
   - Total number of files

2. **File Sections**:
   - File path header
   - Separator line
   - Complete file content
   - Section separator

Example output:

```
MERGED FILES FROM: src
Generated on: 2025-12-04T20:50:24.544Z
Total files: 37

================================================================================

FILE: src/App.tsx
------------------------------------------------------------
import React from 'react';
// ... file content ...

================================================================================
```

## Supported File Types

- `.js`, `.jsx` - JavaScript files
- `.ts`, `.tsx` - TypeScript files
- `.mts`, `.cts` - TypeScript module files
- `.css`, `.scss` - Stylesheets
- `.html` - HTML files
- `.md` - Markdown files
- `.txt` - Text files
- `.json` - JSON files

## Excluded Directories

The script automatically skips these common directories:

- `node_modules`
- `.git`
- `dist`
- `build`
- `.next`
- `.nuxt`

## Examples

### Merge Source Code

```bash
node merge-files.js src ./backup/source-code.txt
```

### Merge Documentation

```bash
node merge-files.js docs ./archive/docs.txt
```

### Merge Configuration Files

```bash
node merge-files.js . ./config/all-config.txt
```

## Requirements

- Node.js 14+ with ES modules support
- File system read permissions for target directory

## Error Handling

- Directory read errors are logged but don't stop processing
- File read errors show error messages in output
- Missing directories are created automatically
- Invalid paths show helpful error messages

## Use Cases

- **Code Reviews**: Share entire codebase in single file
- **Backup**: Archive project state
- **Analysis**: Feed codebase to AI/LLM tools
- **Documentation**: Create comprehensive code dumps
- **Migration**: Prepare code for transfer

## Technical Details

- Uses ES module syntax (`import`/`export`)
- Recursive directory traversal with `fs.readdirSync`
- UTF-8 encoding for all file operations
- Sorted file output for consistency
- Memory-efficient streaming for large files
