# MCP Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Figma Token
1. Go to https://www.figma.com/settings
2. Click **Account** → **Personal Access Tokens**
3. Click **Create new token**
4. Copy the token immediately (you won't see it again!)

### Step 2: Configure in Cursor
1. Open Cursor Settings: `Ctrl+,` (or `Cmd+,` on Mac)
2. Search for "MCP" in settings
3. Add this configuration:

```json
{
  "mcp": {
    "servers": {
      "figma": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-figma"],
        "env": {
          "FIGMA_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN_HERE"
        }
      }
    }
  }
}
```

**Or** set as environment variable:
```bash
# Windows PowerShell
$env:FIGMA_PERSONAL_ACCESS_TOKEN = "your-token"

# Mac/Linux
export FIGMA_PERSONAL_ACCESS_TOKEN="your-token"
```

### Step 3: Test It!
1. Open a Figma file in Figma Desktop App
2. In Cursor, ask: **"Get design context from Figma file [file-key], node [node-id]"**
3. Or simply: **"What's in my current Figma file?"**

## 📋 Common Commands

### Get Design Code
```
"Generate React component from Figma node 1:2 in file abc123"
"Get the design context for the selected Figma frame"
```

### Extract Design System
```
"Get all design tokens from this Figma file"
"What variables are defined in the current Figma file?"
```

### Screenshot Designs
```
"Take a screenshot of node 1:2 from Figma file abc123"
```

## 🎨 Using with YadaLearn Project

### Example Workflow

1. **Design in Figma**: Create your UI components
2. **Share File Key**: Copy your Figma file URL → extract the file key
3. **Get Node ID**: Select a component in Figma → Right-click → Copy Link → extract node ID
4. **Ask Cursor**: "Generate a React component matching the design in Figma file [key], node [id]"
5. **Update Code**: Cursor will generate TypeScript/React code matching your design!

### Example Prompt
```
Generate a TeacherCard component based on the design in Figma file 
xyz789, node 123:456. Use TypeScript, React, and Tailwind CSS to match 
the exact styling, spacing, and colors shown in the design.
```

## 🔍 Finding Figma File Keys and Node IDs

### From Figma URL
```
https://figma.com/file/ABC123DEF456/MyDesign?node-id=123-456
                      ^^^^^^^^^^^^^        ^^^^^^^^^^
                      File Key             Node ID (format: 123:456)
```

### From Figma Desktop App
1. Right-click on any component/frame
2. Select "Copy link"
3. Extract the file key and node ID from the URL

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| "Token invalid" | Regenerate token at figma.com/settings |
| "Cannot connect" | Make sure Figma Desktop App is running |
| "MCP server not found" | Run `npm install -g @modelcontextprotocol/server-figma` |
| "No response" | Restart Cursor completely |

## 🔐 Security Notes

- ✅ Store tokens as environment variables (not in code)
- ✅ Never commit tokens to Git
- ✅ Rotate tokens periodically
- ✅ Use personal access tokens (not full API keys)

## 📚 More Information

- Full setup guide: [MCP_SETUP.md](./MCP_SETUP.md)
- Figma MCP docs: https://www.figma.com/mcp
- Cursor docs: https://cursor.sh/docs

## 🎯 Dribbble Note

Dribbble doesn't have official MCP support yet, but you can:
1. Share Dribbble URLs with the AI for inspiration
2. Use Figma Community files (many Dribbble designs remade in Figma)
3. Check MCP community servers: https://github.com/modelcontextprotocol

---

**Ready to go?** Start by getting your Figma token and testing with a simple design!
