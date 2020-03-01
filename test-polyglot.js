//https://airbnb.io/polyglot.js/
const Polyglot = require("node-polyglot");

let polyglot = new Polyglot();

let phraseEs = {
    "thing" : "thingEs"
}

let phraseFr = {
    "thing" : "thingFr"
}

function loadLocale(locale){

    let phrases = (locale === 'fr') ? phraseFr : phraseEs;

    polyglot.locale(locale);
    polyglot.replace(phrases)
}

loadLocale("fr");
console.log("exp1" + polyglot.t("thing"));

loadLocale("es");
console.log("exp2" + polyglot.t("thing"));

