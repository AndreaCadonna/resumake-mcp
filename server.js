#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";

// Configuration
const RESUME_ENDPOINT = "https://latexresu.me/api/generate/resume";
const OUTPUT_DIR = "./generated-resumes";

class ResumeGeneratorServer {
  constructor() {
    this.server = new Server(
      {
        name: "resume-generator",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "generate_resume",
          description:
            "Generate a resume PDF using the LaTeX Resume API. Provide resume data and get a professionally formatted PDF.",
          inputSchema: {
            type: "object",
            properties: {
              resumeData: {
                type: "object",
                description: "Complete resume data object",
                properties: {
                  selectedTemplate: {
                    type: "integer",
                    description: "Template number (1-10)",
                    default: 1,
                  },
                  headings: {
                    type: "object",
                    properties: {
                      work: { type: "string", default: "Work Experience" },
                      education: { type: "string", default: "Education" },
                      skills: { type: "string", default: "Skills" },
                      projects: { type: "string", default: "Projects" },
                    },
                  },
                  basics: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "Full name" },
                      email: { type: "string", description: "Email address" },
                      phone: { type: "string", description: "Phone number" },
                      website: {
                        type: "string",
                        description: "Personal website or portfolio",
                      },
                      location: {
                        type: "object",
                        properties: {
                          address: {
                            type: "string",
                            description: "Address or city",
                          },
                        },
                      },
                    },
                    required: ["name"],
                  },
                  education: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        institution: { type: "string" },
                        location: { type: "string" },
                        area: { type: "string", description: "Field of study" },
                        studyType: {
                          type: "string",
                          description: "Degree type (e.g., Bachelor, Master)",
                        },
                        startDate: { type: "string" },
                        endDate: { type: "string" },
                        gpa: { type: "string" },
                      },
                    },
                  },
                  work: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        company: { type: "string" },
                        location: { type: "string" },
                        position: { type: "string" },
                        website: { type: "string" },
                        startDate: { type: "string" },
                        endDate: { type: "string" },
                        highlights: {
                          type: "array",
                          items: { type: "string" },
                        },
                      },
                    },
                  },
                  skills: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Skill category" },
                        level: {
                          type: "string",
                          description: "Proficiency level",
                        },
                        keywords: {
                          type: "array",
                          items: { type: "string" },
                        },
                      },
                    },
                  },
                  projects: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        url: { type: "string" },
                        keywords: {
                          type: "array",
                          items: { type: "string" },
                        },
                      },
                    },
                  },
                  awards: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        date: { type: "string" },
                        awarder: { type: "string" },
                        summary: { type: "string" },
                      },
                    },
                  },
                },
              },
              filename: {
                type: "string",
                description:
                  "Optional filename for the saved PDF (without extension)",
                default: "resume",
              },
            },
            required: ["resumeData"],
          },
        },
        {
          name: "create_resume_template",
          description:
            "Create a template resume structure with placeholder data that can be filled in",
          inputSchema: {
            type: "object",
            properties: {
              templateNumber: {
                type: "integer",
                description: "Template number (1-10)",
                default: 1,
              },
            },
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "generate_resume":
          return await this.generateResume(request.params.arguments);
        case "create_resume_template":
          return await this.createResumeTemplate(request.params.arguments);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  async createResumeTemplate(args) {
    const { templateNumber = 1 } = args;

    const template = {
      selectedTemplate: templateNumber,
      headings: {
        work: "Work Experience",
        education: "Education",
        skills: "Skills",
        projects: "Projects",
      },
      basics: {
        name: "[Your Full Name]",
        email: "[your.email@example.com]",
        phone: "[Your Phone Number]",
        website: "[Your Website/LinkedIn]",
        location: {
          address: "[Your City, State]",
        },
      },
      education: [
        {
          institution: "[University Name]",
          location: "[City, State]",
          area: "[Your Major]",
          studyType: "[Degree Type]",
          startDate: "[Start Date]",
          endDate: "[End Date]",
          gpa: "[GPA if relevant]",
        },
      ],
      work: [
        {
          company: "[Company Name]",
          location: "[City, State]",
          position: "[Job Title]",
          website: "[Company Website]",
          startDate: "[Start Date]",
          endDate: "[End Date]",
          highlights: [
            "[Key achievement or responsibility]",
            "[Another achievement with metrics if possible]",
            "[Third achievement or skill demonstrated]",
          ],
        },
      ],
      skills: [
        {
          name: "[Skill Category]",
          level: "[Proficiency Level]",
          keywords: [
            "[Specific Skill 1]",
            "[Specific Skill 2]",
            "[Specific Skill 3]",
          ],
        },
      ],
      projects: [
        {
          name: "[Project Name]",
          description: "[Brief project description and your role]",
          url: "[Project URL if available]",
          keywords: ["[Technology Used]", "[Skill Demonstrated]"],
        },
      ],
      awards: [
        {
          date: "[Award Date]",
          awarder: "[Organization/Institution]",
          summary: "[Award Name and Brief Description]",
        },
      ],
      sections: [
        "templates",
        "profile",
        "education",
        "work",
        "skills",
        "projects",
        "awards",
      ],
    };

    return {
      content: [
        {
          type: "text",
          text:
            `📝 Resume Template (Template #${templateNumber})\n\n` +
            `Here's a template structure you can fill in:\n\n` +
            `\`\`\`json\n${JSON.stringify(template, null, 2)}\n\`\`\`\n\n` +
            `Replace all placeholder text in brackets with your actual information, then use the generate_resume tool to create your PDF.`,
        },
      ],
    };
  }

  async generateResume(args) {
    try {
      const { resumeData, filename = "resume" } = args;

      // Ensure the resume data has the required structure
      const completeResumeData = {
        selectedTemplate: 1,
        headings: {
          work: "Work Experience",
          education: "Education",
          skills: "Skills",
          projects: "Projects",
        },
        basics: {
          email: "",
          phone: "",
          website: "",
          location: { address: "" },
          name: "",
        },
        education: [],
        work: [],
        skills: [],
        projects: [],
        awards: [],
        sections: [
          "templates",
          "profile",
          "education",
          "work",
          "skills",
          "projects",
          "awards",
        ],
        ...resumeData,
      };

      // Ensure output directory exists
      await fs.mkdir(OUTPUT_DIR, { recursive: true });

      const response = await fetch(RESUME_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        body: JSON.stringify(completeResumeData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Resume API responded with status: ${response.status} ${response.statusText}. Response: ${errorText}`
        );
      }

      // Check if response is actually a PDF
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        const text = await response.text();
        throw new Error(
          `Expected PDF response but got: ${contentType}. Response: ${text.substring(
            0,
            500
          )}...`
        );
      }

      // Save PDF to file
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .split("T")[0];
      const pdfFilename = `${filename}-${timestamp}.pdf`;
      const filePath = path.join(OUTPUT_DIR, pdfFilename);

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      const fullPath = path.resolve(filePath);

      return {
        content: [
          {
            type: "text",
            text:
              `✅ Resume generated successfully!\n\n` +
              `📄 **File saved to:** ${fullPath}\n` +
              `📏 **File size:** ${(buffer.length / 1024).toFixed(2)} KB\n` +
              `🎨 **Template used:** #${completeResumeData.selectedTemplate}\n` +
              `👤 **Resume for:** ${
                completeResumeData.basics.name || "Unknown"
              }\n\n` +
              `The resume PDF is ready to use!`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text:
              `❌ **Error generating resume:** ${error.message}\n\n` +
              `Please check:\n` +
              `• Your internet connection\n` +
              `• That all required fields are filled\n` +
              `• The resume data structure is correct`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Resume Generator MCP server running on stdio");
  }
}

const server = new ResumeGeneratorServer();
server.run().catch(console.error);
