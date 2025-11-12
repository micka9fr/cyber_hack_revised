// systems/cyber_hack_revised/cyber-hack.js
import { CyberHackActor } from "./module/actor/actor.js";
import { CyberHackCharacterSheet } from "./module/actor/actor-sheet.js";
import { TalentSheet } from "./module/items/talent-sheet.js";

Hooks.once('init', () => {
    console.log("Cyber Hack | INIT");

    // === HELPERS ===
    Handlebars.registerHelper('times', function(n, block) {
        let accum = '';
        for (let i = 0; i < n; ++i) {
            block.data.index = i;
            accum += block.fn(i);
        }
        return accum;
    });

    Handlebars.registerHelper({
        set: (varName, varValue, options) => options.data.root[varName] = varValue,
        get: (varName, options) => options.data.root[varName],
        concat: (...args) => { args.pop(); return args.join(''); }
    });

    // === ACTOR ===
    CONFIG.Actor.documentClass = CyberHackActor;

    // === ACTOR SHEETS ===
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("cyberhack", CyberHackCharacterSheet, {
        types: ["character"],
        makeDefault: true,
        label: "Cyber Hack Sheet"
    });

    // === TALENT SHEETS ===
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("cyberhack", TalentSheet, {
        types: ["talent"],
        makeDefault: true,
        label: "Fiche Talent"
    });

    // === TEMPLATES ===
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