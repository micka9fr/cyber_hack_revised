// module/items/talent-sheet.js
export class TalentSheet extends ItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["cyberhack", "sheet", "item"],
            template: "systems/cyber_hack_revised/templates/item/talent-sheet.hbs",
            width: 500,
            height: 400,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    getData() {
        const context = super.getData();
        context.system = this.item.system;
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Gérer les modificateurs (ajouter/supprimer)
        html.find('.add-modifier').click(this._onAddModifier.bind(this));
        html.find('.delete-modifier').click(this._onDeleteModifier.bind(this));
    }

    async _onAddModifier(event) {
        event.preventDefault();
        const modifiers = foundry.utils.deepClone(this.item.system.modifiers || {});
        const key = `newMod${Date.now()}`;
        modifiers[key] = { key: "", value: 0 };
        await this.item.update({ "system.modifiers": modifiers });
    }

    async _onDeleteModifier(event) {
        event.preventDefault();
        const key = event.currentTarget.closest('.modifier-item').dataset.key;
        const modifiers = foundry.utils.deepClone(this.item.system.modifiers);
        delete modifiers[key];
        await this.item.update({ "system.modifiers": modifiers });
    }
}