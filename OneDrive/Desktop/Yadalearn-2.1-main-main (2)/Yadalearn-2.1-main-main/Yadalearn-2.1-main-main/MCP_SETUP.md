# MCP Setup Guide for YadaLearn Project

This guide will help you set up Model Context Protocol (MCP) integrations for **Figma** and **Dribbble** in your Cursor IDE.

## Overview

MCP allows AI assistants to access and interact with your design tools directly, enabling:
- Extract design specifications from Figma
- Generate code from Figma designs
- Get design inspiration from Dribbble
- Access design system components and tokens

## Prerequisites

1. **Figma Account**: You need a Figma account with access to your design files
2. **Figma Desktop App**: Install the Figma desktop app (required for MCP integration)
3. **Figma Personal Access Token**: Required for API access
4. **Dribbble Account** (optional): For design inspiration

## Step 1: Figma MCP Setup

### Get Your Figma Personal Access Token

1. Go to [Figma Settings](https://www.figma.com/settings)
2. Navigate to **Account** → **Personal Access Tokens**
3. Click **Create new token**
4. Name it (e.g., "Cursor MCP Integration")
5. Copy the token (you'll only see it once!)

### Configure Figma MCP in Cursor

Figma MCP is typically configured through Cursor's settings. Here's how:

1. **Open Cursor Settings**
   - Press `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac)
   - Or go to File → Preferences → Settings

2. **Navigate to MCP Settings**
   - Search for "MCP" in settings
   - Or manually edit your settings JSON file

3. **Add Figma MCP Configuration**

Add this to your Cursor settings JSON:

```json
{
  "mcp": {
    "servers": {
      "figma": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-figma"
        ],
        "env": {
          "FIGMA_PERSONAL_ACCESS_TOKEN": "YOUR_FIGMA_TOKEN_HERE"
        }
      }
    }
  }
}
```

**Note**: Replace `YOUR_FIGMA_TOKEN_HERE` with your actual Figma personal access token.

### Alternative: Install Figma MCP Server Globally

You can also install the Figma MCP server as a global package:

```bash
npm install -g @modelcontextprotocol/server-figma
```

Then configure it in your settings:

```json
{
  "mcp": {
    "servers": {
      "figma": {
        "command": "mcp-server-figma",
        "env": {
          "FIGMA_PERSONAL_ACCESS_TOKEN": "YOUR_FIGMA_TOKEN_HERE"
        }
      }
    }
  }
}
```

## Step 2: Dribbble MCP Setup

Dribbble doesn't have an official MCP server yet, but you can:

### Option A: Use Community MCP Servers

Some community-built MCP servers might be available. Check:
- [MCP Registry](https://github.com/modelcontextprotocol/servers)
- [Awesome MCP](https://github.com/modelcontextprotocol/awesome-mcp)

### Option B: Custom Dribbble Integration

If you want to create custom Dribbble integration:

1. **Dribbble API Access**
   - Sign up at [Dribbble API](https://dribbble.com/account/applications/new)
   - Create a new application
   - Get your access token

2. **Create Custom MCP Server** (Advanced)
   - Use the MCP SDK to build a custom server
   - Connect to Dribbble API
   - Expose design search and retrieval tools

### Option C: Browser Extension (Temporary Solution)

While waiting for official Dribbble MCP support:
- Use browser extensions to copy Dribbble design URLs
- Share URLs with AI assistant for context
- Use Figma's community resources (many Dribbble designs are remade in Figma)

## Step 3: Verify Installation

### Test Figma MCP

1. Open a Figma file in the Figma desktop app
2. In Cursor, try asking:
   - "Get design context from Figma"
   - "What components are in the current Figma file?"
   - "Generate code for the selected Figma design"

3. The AI should be able to access your Figma designs

### Available Figma MCP Tools

Once configured, you'll have access to:
- `get_design_context`: Get UI code for a Figma node
- `get_metadata`: Get metadata for nodes/pages
- `get_screenshot`: Generate screenshots of Figma designs
- `get_variable_defs`: Get design system variables
- `get_code_connect_map`: Get Code Connect mappings
- `create_design_system_rules`: Generate design system rules

## Step 4: Environment Variables

For security, consider storing tokens as environment variables:

### Windows (PowerShell)
```powershell
$env:FIGMA_PERSONAL_ACCESS_TOKEN = "your-token-here"
```

### Windows (CMD)
```cmd
set FIGMA_PERSONAL_ACCESS_TOKEN=your-token-here
```

### Mac/Linux
```bash
export FIGMA_PERSONAL_ACCESS_TOKEN="your-token-here"
```

Then update your Cursor settings to use the environment variable:

```json
{
  "mcp": {
    "servers": {
      "figma": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-figma"],
        "env": {
          "FIGMA_PERSONAL_ACCESS_TOKEN": "${FIGMA_PERSONAL_ACCESS_TOKEN}"
        }
      }
    }
  }
}
```

## Troubleshooting

### Figma MCP Not Working

1. **Check Figma Desktop App**: Ensure Figma desktop app is running
2. **Verify Token**: Make sure your token is valid and has correct permissions
3. **Check Node.js**: Ensure Node.js is installed (required for npm/npx)
4. **Restart Cursor**: After configuration changes, restart Cursor completely

### Common Errors

- **"Token invalid"**: Regenerate your Figma token
- **"Cannot connect to Figma"**: Ensure Figma desktop app is running
- **"MCP server not found"**: Install the MCP server package globally or use npx

### Getting Help

- [Figma MCP Documentation](https://www.figma.com/mcp)
- [MCP GitHub Repository](https://github.com/modelcontextprotocol)
- [Cursor Discord Community](https://discord.gg/cursor)

## Security Best Practices

1. **Never commit tokens to Git**: Add `.env` or settings files with tokens to `.gitignore`
2. **Use environment variables**: Store sensitive tokens as environment variables
3. **Rotate tokens regularly**: Generate new tokens periodically
4. **Limit token permissions**: Only grant necessary permissions
5. **Use personal access tokens**: Not API keys with broader access

## Example Workflow

### Using Figma MCP in Your Project

1. **Design in Figma**: Create your UI designs in Figma
2. **Open in Cursor**: Have the Figma file open in Figma desktop app
3. **Ask AI**: In Cursor, ask: "Get the design context for node 1:2 in file abc123"
4. **Generate Code**: AI will extract the design and generate React/TypeScript code
5. **Sync Updates**: As designs change, regenerate code automatically

### Example Prompts

```
"Get the design context from Figma file abc123, node 1:2"
"Generate a React component based on the selected Figma frame"
"What design tokens are used in the current Figma file?"
"Create a design system from this Figma file"
```

## Next Steps

1. Set up your Figma personal access token
2. Configure MCP in Cursor settings
3. Test with a simple Figma file
4. Start generating code from your designs!
5. (Optional) Explore community MCP servers for Dribbble

## Resources

- [Figma MCP Catalog](https://www.figma.com/mcp-catalog/)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [Cursor Documentation](https://cursor.sh/docs)
- [Figma API Documentation](https://www.figma.com/developers/api)

---

**Note**: MCP setup may vary depending on your Cursor version. If the above doesn't work, check the latest Cursor documentation for MCP configuration.
