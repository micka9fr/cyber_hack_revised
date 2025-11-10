import { CyberHackActor } from "./actor/actor.js";
import { CyberHackActorSheet } from "./actor/actor-sheet.js";


Hooks.once('init', async function(){
    game.cyberHack = {
        CyberHackActor
    }
});

// Define custom Entity classes
CONFIG.Actor.documentClass = CyberHackActor;
//CONFIG.Item.documentClass = CyberHackItem;

foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
foundry.documents.collections.Actors.registerSheet("mosh", CyberHackActorSheet, {types: ['character'], makeDefault: true});