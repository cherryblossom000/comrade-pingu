set -e

# semantic-release
pnpx multi-semantic-release

# Update package.json (could have changed due to semantic-release) and remove
# devDependencies so thhey aren't installed on Repl.it
node scripts/dist/update-package

(
  cd packages/bot/dist

  # Add .replit
  echo "language = 'nodejs'" > .replit
  echo "run = 'node src/server'" >> .replit

  # Init repo
  git init
  git remote add origin "https://$GH_TOKEN@github.com/cherryblossom000/comrade-pingu"
  git checkout -b repl
  # Push to repl branch
  git add *.js .replit package.json **/*.js assets ':!**/*.DS_Store'
  git commit -m "chore: update from travis build #$TRAVIS_BUILD_NUMBER"
  git push -f origin repl
)
