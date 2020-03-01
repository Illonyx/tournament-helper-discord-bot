const fs = require('fs');
const UserSettingsManager = require('./user-settings-manager')
const Polyglot = require('node-polyglot');

export class LanguageManager {

	polyglot = new Polyglot();

	constructor() {
		var languagesJSON = fs.readFileSync('languages.json')
		this.languageDictionary = JSON.parse(languagesJSON)
		this.userSettingsManager = new UserSettingsManager();
		this.loadLocale(this.userSettingsManager.getCurrentLanguage());
	}

	loadLocale(locale){
		let localePhrases = this.languageDictionary[locale];
		this.polyglot.extend(localePhrases);
	}


	//Constuire le résumé en markdown avec les flags
	getAvailableLanguages() {
		return this.languageDictionary.languages.length;
	}

	//Renvoie la string correctement traduite avec la clé correspondante
	getI18NStringForLanguage(key, language) {
		var dictionary = this.languageDictionary.dictionary
		var dictElement = dictionary.find(function(dictElement){
			return dictElement.key == key
		})
		if(dictElement == null){
			console.error("No language keys found in language dictionary matching with : " + key)
			return "There is a translation problem for this command";
		}
		return dictElement["languages"][language]
	}

	getPolyglotInstance(){
		return this.polyglot;
	}

	getI18NString(key){
		 let userLanguageKey = this.userSettingsManager.getCurrentLanguage()
		 return this.getI18NStringForLanguage(key, userLanguageKey)
	}

}