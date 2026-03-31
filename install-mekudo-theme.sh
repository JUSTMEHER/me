#!/bin/bash

# Mekudo Nodes - Pterodactyl Theme Installer
# Designed to match Mekudo brand identity

PANEL_DIR="/var/www/pterodactyl"
BACKUP_FILE="/root/pterodactyl-pre-mekudo-$(date +%Y%m%d%H%M%S).tar.gz"

echo ""
echo "  ███╗   ███╗███████╗██╗  ██╗██╗   ██╗██████╗  ██████╗ "
echo "  ████╗ ████║██╔════╝██║ ██╔╝██║   ██║██╔══██╗██╔═══██╗"
echo "  ██╔████╔██║█████╗  █████╔╝ ██║   ██║██║  ██║██║   ██║"
echo "  ██║╚██╔╝██║██╔══╝  ██╔═██╗ ██║   ██║██║  ██║██║   ██║"
echo "  ██║ ╚═╝ ██║███████╗██║  ██╗╚██████╔╝██████╔╝╚██████╔╝"
echo "  ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ "
echo ""
echo "  Mekudo Nodes Theme Installer"
echo "  ─────────────────────────────"
echo ""

# Backup
echo "  [1/6] Creating backup..."
tar -czf "$BACKUP_FILE" \
    "$PANEL_DIR/resources/scripts/assets/css/" \
    "$PANEL_DIR/tailwind.config.js" \
    "$PANEL_DIR/resources/scripts/components/NavigationBar.tsx" \
    "$PANEL_DIR/resources/views/templates/wrapper.blade.php" \
    2>/dev/null
echo "  ✓ Backup saved to $BACKUP_FILE"

# Copy GlobalStylesheet
echo "  [2/6] Applying Mekudo global styles..."
cp /home/claude/GlobalStylesheet.ts "$PANEL_DIR/resources/scripts/assets/css/GlobalStylesheet.ts"
echo "  ✓ GlobalStylesheet updated"

# Copy sidebar CSS
echo "  [3/6] Applying Mekudo sidebar styles..."
cp /home/claude/sidebar.css "$PANEL_DIR/resources/scripts/assets/css/sidebar.css"
echo "  ✓ Sidebar CSS updated"

# Copy tailwind config
echo "  [4/6] Updating Tailwind config with Sora font..."
cp /home/claude/tailwind.config.js "$PANEL_DIR/tailwind.config.js"
echo "  ✓ Tailwind config updated"

# Copy NavigationBar
echo "  [5/6] Updating NavigationBar component..."
cp /home/claude/NavigationBar.tsx "$PANEL_DIR/resources/scripts/components/NavigationBar.tsx"
echo "  ✓ NavigationBar updated"

# Fix ownership
echo "  [6/6] Fixing file ownership..."
chown -R www-data:www-data "$PANEL_DIR/resources/scripts/assets/css/"
chown www-data:www-data "$PANEL_DIR/tailwind.config.js"
chown www-data:www-data "$PANEL_DIR/resources/scripts/components/NavigationBar.tsx"
echo "  ✓ Ownership fixed"

echo ""
echo "  ─────────────────────────────"
echo "  Theme files installed! Now rebuild:"
echo ""
echo "    cd $PANEL_DIR"
echo "    nvm use 18"
echo "    NODE_OPTIONS=\"--openssl-legacy-provider\" yarn build:production"
echo ""
echo "  Restore command if needed:"
echo "    tar -xzf $BACKUP_FILE -C /"
echo ""
