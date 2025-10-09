# pnpm Usage Guide for T-Rex Microfrontend Application

This guide covers using pnpm as the package manager for the T-Rex microfrontend application.

## 🚀 Why pnpm?

- **Faster installations**: Up to 2x faster than npm
- **Disk space efficient**: Uses hard links and symlinks to save space
- **Strict dependency resolution**: Prevents phantom dependencies
- **Better monorepo support**: Excellent workspace management
- **Compatible with npm**: Drop-in replacement for most npm commands

## 📦 Installation

### Install pnpm globally

```bash
# Using npm
npm install -g pnpm

# Using corepack (Node.js 16.10+)
corepack enable
corepack prepare pnpm@latest --activate

# Using standalone script
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Using Homebrew (macOS)
brew install pnpm
```

### Verify installation

```bash
pnpm --version
```

## 🏗️ Project Setup

### Initial setup

```bash
# Clone the repository
git clone <repository-url>
cd t_rex_simplified

# Install all dependencies
pnpm install
```

### Workspace commands

```bash
# Install dependencies for all workspaces
pnpm install

# Install dependency in specific workspace
pnpm --filter buying-flow add axios

# Install dev dependency in specific workspace
pnpm --filter shared-ui add -D eslint

# Run script in all workspaces
pnpm -r build

# Run script in specific workspace
pnpm --filter host-app start
```

## 🔧 Common Commands

### Development

```bash
# Start all frontend services
pnpm run dev

# Start specific services
pnpm run start:host
pnpm run start:shared
pnpm --filter buying-flow start

# Build all projects
pnpm run build:all

# Build specific project
pnpm --filter host-app build
```

### Package Management

```bash
# Add dependency to root
pnpm add concurrently

# Add dependency to workspace
pnpm --filter buying-flow add react-router-dom

# Add dev dependency
pnpm --filter shared-ui add -D @types/jest

# Remove dependency
pnpm --filter host-app remove webpack

# Update dependencies
pnpm update

# Update specific dependency
pnpm --filter buying-flow update axios
```

### Workspace Filtering

```bash
# Run command in multiple workspaces
pnpm --filter "./packages/*" build

# Run command in workspaces matching pattern
pnpm --filter "*flow*" test

# Exclude workspaces
pnpm --filter "!host-app" build

# Run in workspace and its dependencies
pnpm --filter buying-flow... build
```

## 📁 Workspace Structure

The project uses pnpm workspaces defined in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'packages/*'      # Shared libraries
  - 'microfrontends/*' # Microfrontend applications
  - 'host-app'        # Host application
```

### Package naming

- **Root**: `t-rex-microfrontend-root`
- **Shared UI**: `@t-rex/shared-ui`
- **Buying Flow**: `@t-rex/buying-flow`
- **Host App**: `@t-rex/host-app`

## 🔄 Migration from npm

### Automatic migration

```bash
# pnpm can automatically convert package-lock.json
pnpm install

# Or import from existing lockfile
pnpm import
```

### Manual steps

1. Replace `npm install` with `pnpm install`
2. Replace `npm run` with `pnpm run` or just `pnpm`
3. Update CI/CD scripts to use pnpm
4. Update Dockerfiles to install pnpm

## 🐳 Docker Integration

### Updated Dockerfile pattern

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy source and build
COPY . .
RUN pnpm run build
```

## 🚀 Performance Tips

### Speed optimizations

```bash
# Use frozen lockfile in CI
pnpm install --frozen-lockfile

# Skip optional dependencies
pnpm install --ignore-optional

# Use offline mode when possible
pnpm install --offline

# Parallel execution
pnpm -r --parallel build
```

### Disk space optimization

```bash
# Clean node_modules
pnpm -r clean

# Prune unused packages
pnpm prune

# Store cleanup
pnpm store prune
```

## 🔧 Configuration

### .npmrc settings

Create `.npmrc` in project root:

```ini
# Use pnpm store
store-dir=~/.pnpm-store

# Hoist pattern for compatibility
hoist-pattern[]=*eslint*
hoist-pattern[]=*prettier*

# Auto install peers
auto-install-peers=true

# Strict peer dependencies
strict-peer-dependencies=false
```

### Package.json scripts

```json
{
  "scripts": {
    "install:all": "pnpm install",
    "build:all": "pnpm -r build",
    "test:all": "pnpm -r test",
    "clean:all": "pnpm -r clean && rm -rf node_modules",
    "dev": "concurrently \"pnpm start:host\" \"pnpm --filter buying-flow start\""
  }
}
```

## 🔍 Troubleshooting

### Common issues

**Peer dependency warnings**:
```bash
# Install peer dependencies automatically
pnpm install --auto-install-peers
```

**Phantom dependencies**:
```bash
# pnpm prevents these by default, but if needed:
echo "shamefully-hoist=true" >> .npmrc
```

**Cache issues**:
```bash
# Clear pnpm cache
pnpm store prune

# Verify store integrity
pnpm store status
```

**Lockfile conflicts**:
```bash
# Remove lockfile and reinstall
rm pnpm-lock.yaml
pnpm install
```

### Debug commands

```bash
# Check workspace info
pnpm list --depth=0

# Audit dependencies
pnpm audit

# Check outdated packages
pnpm outdated

# Explain dependency
pnpm why lodash
```

## 📊 Comparison with npm

| Feature | npm | pnpm |
|---------|-----|------|
| Install speed | Baseline | 2x faster |
| Disk usage | Baseline | 3x less |
| Lockfile | package-lock.json | pnpm-lock.yaml |
| Workspaces | ✅ | ✅ Better |
| Phantom deps | ❌ Allows | ✅ Prevents |
| Node modules | Flat/nested | Symlinked |

## 🎯 Best Practices

1. **Always use lockfile**: Commit `pnpm-lock.yaml`
2. **Workspace organization**: Keep related packages together
3. **Dependency management**: Use exact versions for critical deps
4. **CI optimization**: Use `--frozen-lockfile` in CI
5. **Regular updates**: Keep dependencies up to date
6. **Store maintenance**: Periodically run `pnpm store prune`

## 📚 Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [Workspace Guide](https://pnpm.io/workspaces)
- [CLI Reference](https://pnpm.io/cli/add)
- [Configuration](https://pnpm.io/npmrc)

---

For project-specific commands, see the main [README.md](./README.md) file.
