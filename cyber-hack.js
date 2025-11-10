// systems/cyber_hack_revised/cyber_hack.js
import { CyberHackActor } from "./module/actor/actor.js";
import { CyberHackCharacterSheet } from "./module/actor/actor-sheet.js";

// === ENREGISTREMENT DU HELPER "times" ===
Hooks.once('init', () => {
    console.log("Cyber Hack Revised | Initialisation");

    // Enregistrer le helper {{#times}}
    Handlebars.registerHelper('times', function(n, block) {
        let accum = '';
        for (let i = 0; i < n; ++i) {
            block.data.index = i;
            accum += block.fn(i);
        }
        return accum;
    });

    // Enregistrer la classe Actor
    CONFIG.Actor.documentClass = CyberHackActor;

    // Enregistrer la feuille
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("cyberhack", CyberHackCharacterSheet, {
        types: ["character"],
        makeDefault: true,
        label: "Cyber Hack Sheet"
    });

    // Charger les templates .hbs
    loadTemplates([
        "systems/cyber_hack_revised/templates/actor/actor-sheet.hbs",
        "systems/cyber_hack_revised/templates/actor/parts/actor-items.hbs"
    ]);
});