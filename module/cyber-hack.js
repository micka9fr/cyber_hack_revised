import { CyberHackActor } from "./actor/actor.js";
import { CyberHackCharacterSheet } from "./actor/sheet/actor-sheet.js";

Hooks.once('init', () => {
    console.log("Cyber Hack | Initialisation du système");

    // Enregistrer les classes
    CONFIG.Actor.documentClass = CyberHackActor;

    // Charger les templates
    loadTemplates([
        "systems/cyber_hack_revised/templates/actor/actor-sheet.hbs",
        "systems/cyber_hack_revised/templates/actor/parts/actor-items.hbs"
    ]);

    // Enregistrer la feuille
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("cyberhack", CyberHackCharacterSheet, {
        types: ["character"],
        makeDefault: true,
        label: "Cyber Hack - Personnage"
    });
});