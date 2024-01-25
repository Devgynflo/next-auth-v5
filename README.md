A rectifier =>

- 🗹 je n'ai pas les erreurs de retour avec les providers si l'email est déjà utilisé par l'un d'entre eux.

20 janvier 2024

- Initialisation du projet
- Modification de la page d'acceuil
- Création du bouton "login-button" avec la possibilité de changer le comportement de ce dernier, soit en modal ou redirect
- Création de la login Page

  - Création du loginForm (CS)
  - Création du CardWrapper qui prends en props (headerLabel, backButtonLabel, backButtonHref,shwoSocial) (CC)
  - Le composant CardWrapper fait appel aux composant de shadcn-ui (Card, CardContent, CardHeader, CardFooter) (CC)
  - Création des boutton sociaux ()

22 janvier 2024

- Initialisation de la base de donnée
- Importation des models pour la base de donnée (account, user )
  - Suppression des Models non utilisés (Session et verificationToken)
- Connection à la base de donnée
- Création des formulaires de login & register
- Hash du password avec bcrypt
- Initialisation de next-authV5

  - Création du fichier auth.ts à la racine
    - Du fait qu'on utilise un ORM, les sessions en base de donnée ne fonctionneent pas encore,
      donc nous utilisons les jwt
  - Création du fichier middleware à la racine , avec utilisation de la regex (exclu) de Clerck

  ```
  "/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"
  ```

25 janvier 2024
(auth.ts)

- Une callback est appelée sur l'action "login" uniquement avec les credentials
- Je teste si l'utilisateur est connu en bdd
- Puis je teste si son email est vérifié, j'empèche la connection si négatif.

(login_action.ts)

- Lors de la tentative de connection , je teste si l'utilisateur a vérifié son email
  - Si négatif , je crée en bdd sur la collection verificationToken , une entrée avec un token et un expires d'une durée d'une heure
    - Puis j'envoie un mail , incluant un lien d'activation comprenant le token dans le parametre url
    - Sur ce lien d'activation qui renvoie sur mon site /auth/new-verification, je teste :
      1. si le token existe
      2. si le token est toujours valide
      3. je teste si l'utilisateur est connu (existingToken.email)
    - Puis je mets à jour le champs emailVerified sur la collection user
    - et je supprime le token sur la collection verificationToken
  - Si positif , la connexion est possible et renvoie sur la page settings
