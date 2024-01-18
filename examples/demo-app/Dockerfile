# Utilisez une image de base adaptée à votre application
FROM node:current-alpine3.19

# Créez le répertoire de travail
WORKDIR /home/app

# Copiez les fichiers nécessaires dans le conteneur
COPY build ./build

# Installez les dépendances
RUN npm install -g serve --force

# Copiez le reste des fichiers de l'application dans le conteneur
EXPOSE 3000

# Exécutez la commande serve sur le port 8080
CMD ["serve", "-s", "build"]
