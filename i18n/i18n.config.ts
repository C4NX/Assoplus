export default defineI18nConfig(() => ({
  locales: ["fr", "en"],
  messages: {
    fr: {
      localeName: "Français",
      login: {
        title: "Connexion",
        login: "Connexion",
        register: "S'inscrire",
        success: "Connexion réussie.",
        error: "Erreur de connexion, veuillez réessayer plus tard.",
        submit: "Se connecter",
        google: "Se connecter avec Google",
        forgot_password: "Mot de passe oublié ?",
        by_continuing_you_accept: "En continuant, vous acceptez nos",
        terms_of_service: "Conditions Générales d'Utilisation",
        privacy_policy: "Politique Relative aux Données Personnelles",
        and: "et nos",
        no_account: "Pas encore de compte ? ",
        email_already_in_use: "Cette adresse e-mail est déjà utilisée.",
        placeholder: {
          email: "Adresse e-mail",
          password: "Mot de passe",
          lastName: "Votre nom",
          firstName: "Votre prénom",
        },
        reset: {
          title: "Réinitialisation du mot de passe",
          submit: "Envoyer",
          success: "Un e-mail de réinitialisation de mot de passe a été envoyé.",
          error: "Erreur lors de l'envoi de l'e-mail de réinitialisation de mot de passe.",
        },
      },
      register: {
        title: "S'inscrire",
        submit: "S'inscrire sur Asso+",
        success: "Inscription réussie",
        error: "Erreur d'inscription, veuillez réessayer plus tard",
      },
      OR: "OU",
      and: "et",
      header: {
        login: "Se connecter / S'inscrire",
        home: "Accueil",
        associations: "Associations",
      },
      footer: {
        legal: "Mentions légales",
        terms: "CGU",
        privacy: "Politique de confidentialité",
      },
      back: "Retour",
    },
    en: {
      localeName: "English",
    },
  },
}))
