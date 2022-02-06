import { UserSettingsManager } from "./api/user-settings/user-settings-manager";
import { LanguageManager } from "./api/user-settings/language-manager";

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
export class ConfigurationSingleton {
    private static instance: ConfigurationSingleton;
    private userSettingsManager : UserSettingsManager;
    private languageManager : LanguageManager;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {
        this.userSettingsManager = new UserSettingsManager();
        this.languageManager = new LanguageManager(this.userSettingsManager);
    }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): ConfigurationSingleton {
        if (!ConfigurationSingleton.instance) {
            ConfigurationSingleton.instance = new ConfigurationSingleton();
        }

        return ConfigurationSingleton.instance;
    }

    /**
     * Finally, any singleton should define some business logic, which can be
     * executed on its instance.
     */
    public getLanguageManager(): LanguageManager{
        return this.languageManager;
    }

    /**
     * Finally, any singleton should define some business logic, which can be
     * executed on its instance.
     */
    public getUserSettingsManager(): UserSettingsManager{
        return this.userSettingsManager;
    }
}