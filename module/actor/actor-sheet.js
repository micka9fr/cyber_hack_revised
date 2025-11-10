/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class CyberHackActorSheet extends foundry.appv1.sheets.ActorSheet {
    /** @override */
    static get defaultOptions() {
        var options = {
            classes: ["cyberHack", "sheet", "actor", "character"],
            template: "systems/cyber_hack_revised/templates/actor/actor-sheet.html",
            width: 820,
            height: 820,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "character" }]
        }
        return foundry.utils.mergeObject(super.defaultOptions, options);
    }

    /* -------------------------------------------- */


}