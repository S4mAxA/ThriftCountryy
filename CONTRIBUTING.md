# Guide de Contribution - Thrift Country

Merci de votre intérêt pour contribuer à Thrift Country ! Ce guide vous aidera à comprendre comment participer au développement du projet.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- Git
- Un éditeur de code (VS Code recommandé)

### Installation
```bash
# Fork et cloner le repository
git clone https://github.com/votre-username/thrift-country.git
cd thrift-country

# Installer les dépendances (si applicable)
npm install

# Démarrer le serveur de développement
npm run dev
# ou
python -m http.server 8000
```

## 📋 Types de Contributions

### 🐛 Bug Reports
- Utilisez le template "Bug Report"
- Incluez des étapes de reproduction claires
- Ajoutez des captures d'écran si pertinent
- Spécifiez votre environnement (OS, navigateur, etc.)

### ✨ Feature Requests
- Utilisez le template "Feature Request"
- Décrivez clairement la fonctionnalité souhaitée
- Expliquez pourquoi cette fonctionnalité est utile
- Proposez une implémentation si possible

### 🔧 Code Contributions
- Fork le repository
- Créez une branche feature
- Suivez les standards de code
- Ajoutez des tests si applicable
- Soumettez une Pull Request

## 🛠️ Standards de Code

### JavaScript
```javascript
// Utilisez ES6+ features
const example = () => {
  // Préférez const/let à var
  const data = [];
  
  // Utilisez des arrow functions
  const processData = (item) => {
    return item.process();
  };
  
  // Template literals
  const message = `Hello ${name}!`;
  
  // Destructuring
  const { title, price } = product;
};

// Classes avec ES6
class ProductManager {
  constructor() {
    this.products = [];
  }
  
  addProduct(product) {
    this.products.push(product);
  }
}
```

### CSS
```css
/* Utilisez les variables CSS définies */
.product-card {
  background-color: var(--color-white);
  border-radius: var(--border-radius);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
}

/* Préférez Flexbox/Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-xl);
}

/* Mobile-first approach */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
```

### HTML
```html
<!-- Utilisez la sémantique HTML5 -->
<main>
  <section class="products">
    <header class="section-header">
      <h2>Nos Produits</h2>
    </header>
    <div class="products-grid">
      <!-- Contenu -->
    </div>
  </section>
</main>

<!-- Accessibilité -->
<button aria-label="Ajouter au panier" class="btn-add-cart">
  <svg aria-hidden="true"><!-- Icon --></svg>
  Ajouter
</button>
```

## 🧪 Tests

### Tests Manuels
Avant de soumettre une PR, testez :

- [ ] **Navigation** : Tous les liens fonctionnent
- [ ] **Responsive** : Site fonctionne sur mobile/tablet
- [ ] **Accessibilité** : Navigation au clavier, screen readers
- [ ] **Performance** : Chargement rapide, animations fluides
- [ ] **Cross-browser** : Chrome, Firefox, Safari, Edge

### Tests Automatisés
```bash
# Linting
npm run lint

# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e
```

## 📝 Processus de Pull Request

### 1. Préparation
```bash
# Synchroniser avec le repository principal
git remote add upstream https://github.com/original/thrift-country.git
git fetch upstream
git checkout main
git merge upstream/main

# Créer une branche feature
git checkout -b feature/nom-de-la-feature
```

### 2. Développement
- Codez votre fonctionnalité
- Suivez les standards de code
- Ajoutez des tests si applicable
- Mettez à jour la documentation

### 3. Commit
```bash
# Utilisez Conventional Commits
git commit -m "feat: ajouter système de filtres avancés"
git commit -m "fix: corriger bug panier sur mobile"
git commit -m "docs: mettre à jour README"
```

### 4. Push et PR
```bash
git push origin feature/nom-de-la-feature
# Créer Pull Request sur GitHub
```

## 🎨 Guidelines Design

### Palette de Couleurs
- **Noir** : `#000000` - Texte principal, éléments UI
- **Blanc** : `#ffffff` - Arrière-plans, texte sur fond sombre
- **Gris** : Échelle 50-900 pour les variations

### Typographie
- **Inter** : Police principale
- **JetBrains Mono** : Code, compteurs
- Tailles : 0.875rem, 1rem, 1.125rem, 1.25rem, 1.5rem, 2rem, 3rem

### Espacement
- Système cohérent : 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem, 6rem
- Utilisez les variables CSS : `var(--space-*)`

## 🔧 Configuration de l'Environnement

### VS Code Extensions Recommandées
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

### Settings VS Code
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 📚 Documentation

### Commentaires de Code
```javascript
/**
 * Calcule le total du panier avec les taxes
 * @param {Array} items - Liste des produits
 * @param {number} taxRate - Taux de taxe (0.20 = 20%)
 * @returns {number} Total avec taxes
 */
function calculateTotal(items, taxRate = 0.20) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + taxRate);
}
```

### Documentation des Fonctions
- Décrivez le but de la fonction
- Documentez les paramètres et le retour
- Ajoutez des exemples d'utilisation
- Mentionnez les cas d'erreur

## 🚨 Problèmes Courants

### Performance
- **Problème** : Images non optimisées
- **Solution** : Utilisez des formats modernes (WebP), lazy loading

### Accessibilité
- **Problème** : Contraste insuffisant
- **Solution** : Vérifiez avec des outils comme axe-core

### Responsive
- **Problème** : Layout cassé sur mobile
- **Solution** : Testez sur différents appareils, utilisez Flexbox/Grid

## 🤝 Communication

### Issues
- Soyez descriptif et précis
- Incluez des captures d'écran
- Utilisez les labels appropriés

### Pull Requests
- Décrivez clairement les changements
- Référencez les issues concernées
- Répondez aux commentaires de review

### Discussions
- Restez professionnel et respectueux
- Posez des questions si vous n'êtes pas sûr
- Partagez vos idées et suggestions

## 🏆 Reconnaissance

Les contributeurs seront reconnus dans :
- Le fichier `CONTRIBUTORS.md`
- Les releases GitHub
- Le site web (optionnel)

## 📞 Support

### Questions Techniques
- GitHub Discussions
- Issues avec label "question"
- Email : dev@thriftcountry.com

### Mentoring
- Sessions de pair programming
- Code reviews détaillées
- Documentation d'apprentissage

## 🎯 Prochaines Étapes

1. **Lire** : README.md et documentation
2. **Explorer** : Code existant et architecture
3. **Choisir** : Issue ou feature à travailler
4. **Coder** : Suivre les standards
5. **Tester** : Vérifier votre travail
6. **Soumettre** : Pull Request

---

**Merci de contribuer à Thrift Country !** 🚀

Votre travail aide à créer une expérience e-commerce exceptionnelle pour la Gen-Z.
