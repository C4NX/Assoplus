export default defineI18nConfig(() => ({
    locales: ["fr", "en"],
    defaultLocale: "en",
    messages: {
        fr: {
            localeName: "Français",
            login: {
                title: "Connexion",
            },
            header: {
                login: "Connexion",
                signup: "Inscription",
                home: "Accueil",
            },
        },
        en: {
            localeName: "English",
            login: {
                title: "Login",
                home: "Home",
            },
            header: {
                login: "Login",
                signup: "Signup",
                home: "Home",
            },
        },
    },
}))