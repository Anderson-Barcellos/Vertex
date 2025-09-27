#!/bin/bash

echo "========================================"
echo "   Vertex-US - Push para GitHub"
echo "========================================"
echo

# Substitua SEU_USUARIO pelo seu username do GitHub
GITHUB_USER="SEU_USUARIO"

echo "Adicionando remote origin..."
git remote add origin https://github.com/$GITHUB_USER/Vertex-US.git

echo
echo "Fazendo push para o GitHub..."
git push -u origin master

echo
echo "✅ Concluído! Vertex-US está no GitHub!"