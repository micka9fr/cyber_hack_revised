import { CyberHackActor } from "./actor/actor.js";

Hooks.once('init', () => {
    console.log("Cyber Hack | Initialisation");

    // Charger les templates
    loadTemplates([
        "systems/cyber_hack_revised/templates/actor/character-sheet.hbs",
        "systems/cyber_hack_revised/templates/actor/npc-sheet.hbs"
    ]);

    // Enregistrer la classe Actor
    CONFIG.Actor.documentClass = CyberHackActor;

    // Enregistrer les feuilles (à créer plus tard)
    // Actors.registerSheet("cyberhack", CharacterSheet, { types: ["character"], makeDefault: true });
});