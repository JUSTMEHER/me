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
echo "  Mekudo Nodes Theme Installer v2"
echo "  ─────────────────────────────────"
echo ""

# Check panel dir exists
if [ ! -d "$PANEL_DIR" ]; then
    echo "  ✗ Panel not found at $PANEL_DIR — aborting."
    exit 1
fi

# Backup
echo "  [1/7] Creating backup..."
tar -czf "$BACKUP_FILE" \
    "$PANEL_DIR/resources/scripts/assets/css/" \
    "$PANEL_DIR/tailwind.config.js" \
    "$PANEL_DIR/resources/scripts/components/NavigationBar.tsx" \
    "$PANEL_DIR/resources/scripts/components/dashboard/ServerRow.tsx" \
    2>/dev/null
echo "  ✓ Backup saved to $BACKUP_FILE"

# Copy GlobalStylesheet
echo "  [2/7] Applying Mekudo global styles..."
cp "$(dirname "$0")/GlobalStylesheet.ts" "$PANEL_DIR/resources/scripts/assets/css/GlobalStylesheet.ts"
echo "  ✓ GlobalStylesheet updated"

# Copy sidebar CSS
echo "  [3/7] Applying Mekudo sidebar styles..."
cp "$(dirname "$0")/sidebar.css" "$PANEL_DIR/resources/scripts/assets/css/sidebar.css"
echo "  ✓ Sidebar CSS updated"

# Copy tailwind config
echo "  [4/7] Updating Tailwind config with Sora font..."
cp "$(dirname "$0")/tailwind.config.js" "$PANEL_DIR/tailwind.config.js"
echo "  ✓ Tailwind config updated"

# Copy NavigationBar
echo "  [5/7] Updating NavigationBar component..."
cp "$(dirname "$0")/NavigationBar.tsx" "$PANEL_DIR/resources/scripts/components/NavigationBar.tsx"
echo "  ✓ NavigationBar updated"

# Copy ServerRow
echo "  [6/7] Updating ServerRow component (Mekudo server cards)..."
cp "$(dirname "$0")/ServerRow.tsx" "$PANEL_DIR/resources/scripts/components/dashboard/ServerRow.tsx"
echo "  ✓ ServerRow updated"

# Fix ownership
echo "  [7/7] Fixing file ownership..."
chown -R www-data:www-data "$PANEL_DIR/resources/scripts/assets/css/"
chown www-data:www-data "$PANEL_DIR/tailwind.config.js"
chown www-data:www-data "$PANEL_DIR/resources/scripts/components/NavigationBar.tsx"
chown www-data:www-data "$PANEL_DIR/resources/scripts/components/dashboard/ServerRow.tsx"
echo "  ✓ Ownership fixed"

echo ""
echo "  ─────────────────────────────"
echo "  Theme files installed! Now rebuild:"
echo ""
echo "    cd $PANEL_DIR"
echo "    nvm use 18"
echo "    NODE_OPTIONS=\"--openssl-legacy-provider\" yarn build:production"
echo ""
echo "  Then clear cache:"
echo "    php artisan view:clear && php artisan cache:clear"
echo ""
echo "  Restore command if needed:"
echo "    tar -xzf $BACKUP_FILE -C /"
echo ""
