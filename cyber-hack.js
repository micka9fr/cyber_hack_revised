// systems/cyber_hack_revised/cyber_hack.js
import { CyberHackActor } from "./module/actor/actor.js";
import { CyberHackCharacterSheet } from "./module/actor/actor-sheet.js";
import { TalentItem } from "./module/items/talent.js";

Hooks.once('init', () => {
    console.log("Cyber Hack | INIT V13");

    // === 1. ACTOR ===
    CONFIG.Actor.documentClass = CyberHackActor;
    CONFIG.Actor.dataModels.character = CyberHackActor;
    CONFIG.Actor.typeLabels = {
        character: "Cyber Hack Character"
    };

    // === 2. ITEM ===
    CONFIG.Item.dataModels.talent = TalentItem;
    CONFIG.Item.typeLabels = {
        talent: "Talent"
    };

    // === 3. FEUILLES ===
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("cyberhack", CyberHackCharacterSheet, {
        types: ["character"],
        makeDefault: true,
        label: "Cyber Hack Sheet"
    });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("cyber_hack_revised", ItemSheet, {
        types: ["talent"],
        makeDefault: true,
        label: "Fiche Talent"
    });

    // === 4. TEMPLATES ===
    loadTemplates([
        "systems/cyber_hack_revised/templates/actor/actor-sheet.hbs",
        "systems/cyber_hack_revised/templates/actor/parts/actor-items.hbs"
    ]);
});

Hooks.once('ready', async () => {
    const partials = [
        "systems/cyber_hack_revised/templates/actor/parts/sidebar-cyberwares.hbs",
        "systems/cyber_hack_revised/templates/actor/parts/sidebar-talents.hbs",
        "systems/cyber_hack_revised/templates/actor/parts/sidebar-weapons.hbs",
        "systems/cyber_hack_revised/templates/actor/parts/sidebar-gears.hbs",
        "systems/cyber_hack_revised/templates/actor/parts/sidebar-net.hbs",
        "systems/cyber_hack_revised/templates/actor/parts/sidebar-life.hbs"
    ];

    await loadTemplates(partials);
    console.log("Cyber Hack | Partials chargés !");
});