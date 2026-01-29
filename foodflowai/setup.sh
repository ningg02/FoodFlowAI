#!/bin/bash

echo "🚀 Setting up Food Rescue Dashboard..."
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎉 Setup complete! You can now run:"
    echo "   npm run dev    - Start development server"
    echo "   npm run build  - Build for production"
    echo ""
else
    echo ""
    echo "❌ Failed to install dependencies"
    exit 1
fi
