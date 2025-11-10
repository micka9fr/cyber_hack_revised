// module/actor/actor-sheet.js
export class CyberHackCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["cyberhack", "sheet", "actor"],
            template: "systems/cyber_hack_revised/templates/actor/actor-sheet.hbs",
            width: 1100,
            height: 800,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-content", initial: "main" }]
        });
    }

    /** @override */
    getData() {
        const context = super.getData(); // <-- CRUCIAL
        const system = context.actor.system;

        // SÉCURITÉ : Vérifier que system existe
        if (!system) return context;

        // Filtrer les items
        context.cyberware = context.items.filter(i => i.type === "cyberware") || [];
        context.weapons = context.items.filter(i => i.type === "weapon") || [];

        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Jets
        html.find('.rollable').click(this._onRoll.bind(this));

        // Mise à jour auto des compétences
        html.find('input[name*="base"], input[name*="mod"]').change(() => {
            setTimeout(() => {
                this.actor.update({});
                this.render();
            }, 100);
        });
    }

    async _onRoll(event) {
        const el = event.currentTarget;
        const formula = el.dataset.roll;
        const label = el.dataset.label || "Skill Check";
        const roll = new Roll(formula, this.actor.getRollData());
        await roll.evaluate();
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: `<strong>${label}</strong>`
        });
    }
}