const Commando = require('discord.js-commando');

import { LanguageManager } from '../../api/user-settings/language-manager';
import { UserSettingsManager } from '../../api/user-settings/user-settings-manager';
import { ConfigurationSingleton } from '../../configuration-singleton';

export class ChangeLanguageCommand extends Commando.Command {

    userSettingsManager: UserSettingsManager;
    languageManager: LanguageManager;

    constructor(client: any) {

        super(client, {
            name: 'setlanguage',
            group: 'general',
            memberName: 'setlanguage',
            description: 'Set bot language. ',
            examples: ["Prints all supported languages: tr-setlanguage", "Choose a language: tr-setlanguage fr"],
            args: [{
                key: 'text',
                prompt: 'Write new bot\'s language among propositions',
                type: 'string',
                default: ''
            }]

        });
        this.languageManager = ConfigurationSingleton.getInstance().getLanguageManager();
        this.userSettingsManager = ConfigurationSingleton.getInstance().getUserSettingsManager();
    }

    async run(message: any, args: any) {
        const { text } = args
        if (text == '') {
            // Print all supported languages
            let messageContent = this.formatAllSupportedLanguages();
            message.channel.send(messageContent);
        } else {
            // Set new language
            let langItem = this.languageManager.getAvailableLanguages().find((langItem) => {
                return langItem.key == text || langItem.name == text;
            })
            if(langItem){
                this.userSettingsManager.setLocale(langItem.key);  
                this.languageManager.loadLocale();
                message.channel.send(this.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.setlanguage_chosen));
            } else {
                message.reply("Language Key is not correct, retype it");
            }
        }
    }

    formatAllSupportedLanguages(): string {

        let text = "\n";
        text += ">>> " + "**" + this.languageManager.getPolyglotInstance().t(LanguageManager.I18NKeys.setlanguage_choose) + "**" + "\n";

        this.languageManager.getAvailableLanguages().forEach((langItem => {
            text += "\n";
            text += "**" + langItem.name + "**" + "\n";
            text += ":" + langItem.icon + ": " + langItem.key + "\n";
        }))
        
        return text;
    }
}