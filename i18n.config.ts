export default defineI18nConfig(() => ({
    locales: ["fr", "en"],
    defaultLocale: "en",
    messages: {
        fr: {
            localeName: "Français",
            login: {
                title: "Connexion",
                login: "Connexion",
                register: "Inscription",
                success: "Connexion réussie.",
                error: "Erreur de connexion, veuillez réessayer plus tard.",
            },
            header: {
                login: "Connexion",
                register: "Inscription",
                home: "Accueil",
            },
        },
        en: {
            localeName: "English",
            login: {
                title: "Login",
                login: "Login",
                register: "Signup",
                home: "Home",
                success: "Login successful.",
                error: "Error logging in, please try again later.",
            },
            header: {
                login: "Login",
                signup: "Signup",
                home: "Home",
            },
        },
    },
}))