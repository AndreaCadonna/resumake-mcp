# Resume Generator MCP Server

A Model Context Protocol (MCP) server that generates professional PDF resumes using LaTeX templates. Integrates seamlessly with Claude Desktop to create polished resumes from structured data.

![Resume Generator](https://img.shields.io/badge/MCP-Server-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🎨 **9 Professional Templates** - Powered by high-quality LaTeX designs
- 📄 **PDF Generation** - Professional-grade output via LaTeX Resume API
- 🔧 **MCP Integration** - Works directly with Claude Desktop
- 📝 **Structured Data** - Easy-to-use JSON schema for resume data
- 🎯 **Customizable** - Custom headings, sections, and template selection
- 💼 **Professional Quality** - LaTeX-based rendering for crisp, professional results
- 🤖 **AI-Powered** - Natural language resume creation through Claude

## Overview

This MCP server acts as a bridge between Claude Desktop and professional resume generation. Simply describe your resume requirements in natural language to Claude, and it will generate a beautifully formatted PDF resume using LaTeX templates.

## Prerequisites

- Node.js (v16 or higher)
- Claude Desktop application
- Internet connection (for LaTeX Resume API)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/resume-generator-mcp.git
   cd resume-generator-mcp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Claude Desktop:**
   Add the following to your Claude Desktop MCP settings file:

   **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
   **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   **Linux:** `~/.config/Claude/claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "resume-generator": {
         "command": "node",
         "args": ["path/to/resume-generator-mcp/server.js"]
       }
     }
   }
   ```

4. **Restart Claude Desktop** to load the MCP server.

## Usage

Once configured, you can use the resume generator directly in Claude Desktop with natural language. The tool is designed to be flexible and intelligent - you can provide your complete work history and let Claude craft the perfect resume for any situation.

### How It Works

1. **Share Your Experience** - Provide Claude with your complete professional background, education, skills, and achievements
2. **Specify Your Target** - Optionally include a job description or mention the type of role you're targeting
3. **Get Tailored Results** - Claude will automatically select and highlight the most relevant experiences for your specific goal

### Example Requests

#### Basic Resume Generation
```
Create a resume for a software engineer with 5 years experience in React and Node.js
```

#### Personal History + Target Position
```
Here's my background:
- 8 years as a software developer
- Worked at: Microsoft (2018-2021), Google (2021-2023), startup CTO (2023-present)
- Skills: Python, JavaScript, AWS, team leadership, architecture design
- Education: MS Computer Science from MIT
- Led teams of 5-15 people, built systems serving millions of users

I'm applying for this Senior Engineering Manager position at Netflix:
[paste job description here]

Generate a resume that highlights my most relevant experience for this role.
```

#### Template-Specific Generation
```
Generate a resume using template 3 for:
- Name: John Doe
- Email: john.doe@example.com
- Current role: Senior Developer at TechCorp
- Education: BS Computer Science from Stanford
```

#### Career Pivot Scenarios
```
I have 10 years in finance but want to transition to product management. Here's my experience:
[detailed background]

Create a resume that emphasizes my transferable skills for a Product Manager role at a tech company.
```

### Smart Tailoring Features

- **🎯 Relevance Optimization** - Automatically prioritizes experiences that match the target role
- **📈 Achievement Highlighting** - Emphasizes quantifiable results and accomplishments
- **🔄 Skill Alignment** - Matches your skills to job requirements when provided
- **📝 Professional Formatting** - Ensures consistent, ATS-friendly formatting
- **🎨 Template Selection** - Recommends the best template for your industry/role

Claude will automatically structure your information and generate a professional PDF resume tailored to your specific goals.

## API Reference

### Tools Available

#### `generate_resume`
Generates a PDF resume from structured data.

**Parameters:**
- `resumeData` (object): Complete resume information
- `filename` (string, optional): Custom filename for the PDF

#### `create_resume_template`
Creates a template structure with placeholder data.

**Parameters:**
- `templateNumber` (integer, 1-9): Template to use as base

### Resume Data Structure

```json
{
  "selectedTemplate": 1,
  "basics": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "website": "https://johndoe.dev",
    "location": {
      "address": "San Francisco, CA"
    }
  },
  "work": [
    {
      "company": "Tech Corp",
      "position": "Software Engineer",
      "location": "San Francisco, CA",
      "startDate": "2022",
      "endDate": "Present",
      "highlights": [
        "Developed web applications using React and Node.js",
        "Led team of 3 developers on key projects"
      ]
    }
  ],
  "education": [
    {
      "institution": "University of California",
      "area": "Computer Science",
      "studyType": "Bachelor of Science",
      "startDate": "2018",
      "endDate": "2022",
      "location": "Berkeley, CA"
    }
  ],
  "skills": [
    {
      "name": "Frontend",
      "keywords": ["React", "TypeScript", "HTML5", "CSS3"]
    }
  ],
  "projects": [
    {
      "name": "Portfolio Website",
      "description": "Personal portfolio built with Next.js",
      "url": "https://johndoe.dev",
      "keywords": ["Next.js", "React", "Tailwind CSS"]
    }
  ]
}
```

## Configuration

### File Storage
Generated PDFs are saved to:
- **Windows:** `%LOCALAPPDATA%\AnthropicClaude\app-{version}\generated-resumes\`
- **macOS:** `~/Library/Application Support/AnthropicClaude/app-{version}/generated-resumes/`
- **Linux:** `~/.local/share/AnthropicClaude/app-{version}/generated-resumes/`

## Troubleshooting

### Common Issues

1. **"Method not found" errors:**
   - Ensure Claude Desktop is restarted after configuration
   - Check that the path in `claude_desktop_config.json` is correct

2. **Connection errors:**
   - Verify internet connection
   - Check if the LaTeX Resume API is accessible

3. **PDF not generated:**
   - Check the generated-resumes directory permissions
   - Ensure the directory exists and is writable

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
DEBUG=resume-generator node server.js
```

## Development

### Project Structure
```
resume-generator-mcp/
├── server.js              # Main MCP server
├── package.json           # Dependencies and scripts
├── README.md              # This file
└── generated-resumes/     # Output directory (created automatically)
```

### Dependencies
- `@modelcontextprotocol/sdk`: MCP SDK for server implementation
- `axios`: HTTP client for API requests
- `fs/promises`: File system operations

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request with a clear description

## Credits

This project is built on top of several amazing open-source projects and services:

### LaTeX Resume API
- **Service:** [latexresu.me](https://latexresu.me/) - Professional LaTeX resume generation API
- **Credits:** Thanks to the LaTeX Resume API team for providing the backend service that powers the PDF generation

### LaTeX Templates
The beautiful resume templates are based on designs from [resumake.io](https://github.com/saadq/resumake.io) and the broader LaTeX community:

- [Rensselaer Career Development Center](https://www.rpi.edu/dept/arc/training/latex/resumes/)
- [Byungjin Park](https://github.com/posquit0) - Awesome CV template
- [Scott Clark](https://github.com/sc932) - Clean and professional designs
- [Debarghya Das](https://github.com/deedy) - Modern resume templates
- [Xavier Danaux](https://github.com/xdanaux) - Classic LaTeX resume styles
- [Ratul Saha](https://github.com/RatulSaha) - Contemporary designs
- [Daniil Belyakov](https://github.com/dnl-blkv) - Minimalist templates
- [Frits Wenneker](https://www.overleaf.com/latex/templates/your-new-cv/xqzhcmqkqrtw) - Professional CV templates

### Technology Stack
- **MCP (Model Context Protocol)** - [Anthropic](https://anthropic.com) for the protocol specification
- **Claude Desktop** - Integration platform for AI-powered tools
- **Node.js** - Runtime environment
- **LaTeX** - Document preparation system for high-quality typesetting

## License

MIT © Andrea Cadonna

## Support

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/yourusername/resume-generator-mcp/issues)
- 💡 **Feature Requests:** [GitHub Discussions](https://github.com/yourusername/resume-generator-mcp/discussions)
- 📧 **Contact:** andrea.cadonna@gmail.com

## Changelog

### v1.0.0
- Initial release
- Support for 9 LaTeX templates via LaTeX Resume API
- Natural language resume generation through Claude Desktop
- MCP server implementation with structured data support
- Professional PDF output with customizable templates

---

**Made with ❤️ for the Claude Desktop and MCP community**