# bin/

The astack and tbrain command-line entry points.

```
astack       — role / skill CLI  (workflow runner)
tbrain       — memory CLI        (brain DB + MCP server)
```

## Install on PATH

After running the setup script, add this directory to your PATH so `astack` and `tbrain` are globally invokable.

### macOS / Linux

```bash
chmod +x bin/astack bin/tbrain
echo 'export PATH="'"$PWD"'/bin:$PATH"' >> ~/.zshrc   # or ~/.bashrc
source ~/.zshrc
```

### Windows (PowerShell)

```powershell
$env:Path = "$PWD\bin;$env:Path"
# To persist:
[Environment]::SetEnvironmentVariable("Path", "$PWD\bin;$([Environment]::GetEnvironmentVariable('Path', 'User'))", "User")
```

## Verify

```bash
astack --version
tbrain --version
```

## What these commands do

`astack` runs role-scoped Claude Code sessions: pick a team, get a session pre-scoped to its charter and skill allowlist. `tbrain` manages the persistent markdown brain — init, sync, stats, MCP server.

Both wrap underlying binaries on disk; the entry points and conventions are astack-native.
