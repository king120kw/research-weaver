# Setting Up Your Figma Token

## ✅ Your Token Has Been Received

Your Figma Personal Access Token: `<YOUR_FIGMA_TOKEN>`

## 🔐 Secure Setup Methods

### Option 1: Environment Variable (Recommended - Most Secure)

#### Windows PowerShell (Current Session):
```powershell
$env:FIGMA_PERSONAL_ACCESS_TOKEN = "<YOUR_FIGMA_TOKEN>"
```

#### Windows PowerShell (Permanent):
```powershell
[System.Environment]::SetEnvironmentVariable('FIGMA_PERSONAL_ACCESS_TOKEN', '<YOUR_FIGMA_TOKEN>', 'User')
```

#### Windows CMD:
```cmd
setx FIGMA_PERSONAL_ACCESS_TOKEN "<YOUR_FIGMA_TOKEN>"
```

**Note**: You'll need to restart Cursor after setting this!

### Option 2: Cursor Settings (Also Secure)

1. Open Cursor Settings:
   - Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
   - Type "Preferences: Open User Settings (JSON)"
   - Or go to File → Preferences → Settings

2. Add this configuration:
```json
{
  "mcp": {
    "servers": {
      "figma": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-figma"],
        "env": {
          "FIGMA_PERSONAL_ACCESS_TOKEN": "<YOUR_FIGMA_TOKEN>"
        }
      }
    }
  }
}
```

3. Save and restart Cursor

### Option 3: Local .env File (Not Committed)

Create a `.env` file in the project root (already in `.gitignore`):

```env
FIGMA_PERSONAL_ACCESS_TOKEN=<YOUR_FIGMA_TOKEN>
```

Then reference it in your MCP config.

## 🧪 Testing Your Setup

After configuring, test with these steps:

1. **Open Figma Desktop App**
   - Make sure Figma is running (required for MCP)

2. **Open a Figma File**
   - Any file you have access to

3. **In Cursor, try:**
   ```
   Get design context from Figma file [your-file-key], node [node-id]
   ```
   
   Or simply:
   ```
   What Figma files do I have access to?
   ```

4. **Get File Key from Figma URL:**
   ```
   https://figma.com/file/ABC123DEF456/MyDesign
                      ^^^^^^^^^^^^^
                      This is your file key
   ```

## 🔍 Finding Your Figma File Information

### Get File Key:
- Open your Figma file
- Copy the URL
- Extract the part after `/file/` and before `/` → This is your file key

### Get Node ID:
- Select any component/frame in Figma
- Right-click → "Copy link"
- Extract the `node-id=` parameter from the URL
- Format: `123-456` (shown as `123:456` in API)

## 📋 Example Usage

Once configured, you can use prompts like:

```
Generate a React component from Figma file xyz789, node 123:456
```

```
Get all design tokens from Figma file abc123
```

```
Take a screenshot of the design in Figma file xyz789, node 123:456
```

```
What components are in Figma file abc123?
```

## ⚠️ Security Reminders

- ✅ **Token is set as environment variable** (won't be committed)
- ✅ `.env` files are in `.gitignore` (won't be committed)
- ❌ **Never commit tokens to Git**
- ❌ **Don't share your token publicly**
- ✅ **Rotate your token periodically** (regenerate at figma.com/settings)

## 🎯 Next Steps

1. Choose your preferred setup method above
2. Restart Cursor to apply changes
3. Open a Figma file in Figma Desktop App
4. Test with a simple prompt in Cursor
5. Start generating code from your designs!

## 🔄 If Token Doesn't Work

1. Verify token is still valid at figma.com/settings
2. Check Figma Desktop App is running
3. Ensure Node.js is installed (`node --version`)
4. Try regenerating the token if needed

---

**Your token is ready!** Just configure it in Cursor settings or as an environment variable, then restart Cursor.
