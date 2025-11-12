// module/items/talent.js
export class TalentItem extends Item {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            talentValue: new fields.NumberField({
                required: false,
                nullable: true,
                integer: true,
                initial: null
            }),
            cost: new fields.NumberField({
                required: true,
                integer: true,
                min: 1,
                initial: 1
            }),
            description: new fields.HTMLField({
                required: true,
                initial: ""
            }),
            modifiers: new fields.ObjectField({
                required: true,
                nullable: false,
                initial: {}
            })
        };
    }

    // Optionnel : prépare les données
    prepareDerivedData() {
        super.prepareDerivedData();
        this.system.talentValue = this.system.talentValue ?? null;
    }
}