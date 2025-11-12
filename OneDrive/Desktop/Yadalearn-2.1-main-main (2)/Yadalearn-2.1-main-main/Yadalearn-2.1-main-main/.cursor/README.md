# Cursor IDE Configuration

This directory contains Cursor-specific configuration files for the YadaLearn project.

## MCP Configuration

The `mcp-config.json` file contains example configuration for Model Context Protocol (MCP) servers.

### Setting Up MCP in Cursor

1. **Access Cursor Settings**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "Preferences: Open User Settings (JSON)"
   - Or go to File → Preferences → Settings → Search for "MCP"

2. **Add MCP Configuration**
   - Copy the configuration from `mcp-config.json`
   - Paste it into your Cursor settings JSON
   - Replace `${FIGMA_PERSONAL_ACCESS_TOKEN}` with your actual token

3. **Alternative: Environment Variables**
   - Set `FIGMA_PERSONAL_ACCESS_TOKEN` as an environment variable
   - The config will automatically use it

4. **Restart Cursor**
   - Close and reopen Cursor for changes to take effect

### Verifying Setup

After configuration, test with these prompts in Cursor:
- "Get design context from Figma"
- "What's in the current Figma file?"
- "Generate code from Figma design"

### Troubleshooting

If MCP isn't working:
- Ensure Figma Desktop App is running
- Verify your token is valid
- Check that Node.js is installed
- Restart Cursor completely

See the main [MCP_SETUP.md](../MCP_SETUP.md) for detailed instructions.
