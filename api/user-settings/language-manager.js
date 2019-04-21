const fs = require('fs');
const UserSettingsManager = require('./user-settings-manager')

class LanguageManager {

	constructor() {
		var languagesJSON = fs.readFileSync('languages.json')
		this.languageDictionary = JSON.parse(languagesJSON)
		//Singleton à mettre en oeuvre
		this.userSettingsManager = new UserSettingsManager();
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

	getI18NString(key){
		 let userLanguageKey = this.userSettingsManager.getCurrentLanguage()
		 return this.getI18NStringForLanguage(key, userLanguageKey)
	}

}

module.exports=LanguageManager