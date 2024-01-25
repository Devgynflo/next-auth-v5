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
