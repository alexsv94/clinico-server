const { DataTypes } = require('sequelize');
const sequelize = require('../dataBase');

const User = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	firstname: { type: DataTypes.STRING, allowNull: false },
	lastname: { type: DataTypes.STRING, allowNull: false },
	email: { type: DataTypes.STRING, unique: true, allowNull: false },
	password: { type: DataTypes.STRING, allowNull: false },
	role: { type: DataTypes.STRING, defaultValue: 'USER' },
	banned: { type: DataTypes.BOOLEAN, defaultValue: false }
})

const Desease = sequelize.define('desease', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

const Medication = sequelize.define('medication', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, allowNull: false },
	img: { type: DataTypes.STRING },
	indications: { type: DataTypes.TEXT, allowNull: false },
	contrindications: { type: DataTypes.TEXT, allowNull: false },
})

const Symptom = sequelize.define('symptom', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

const Diagnostic = sequelize.define('diagnostic', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

const Note = sequelize.define('note', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	author: { type: DataTypes.STRING, allowNull: false },
	content: { type: DataTypes.TEXT, allowNull: false },
})

const FavoriteDesease = sequelize.define('favorite_desease', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { createdAt: false, updatedAt: false })

const FavoriteMedication = sequelize.define('favorite_medication', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { createdAt: false, updatedAt: false })

const DeseaseSymptom = sequelize.define('desease_symptom', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { createdAt: false, updatedAt: false })

const DeseaseDiagnostic = sequelize.define('desease_diagnostic', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { createdAt: false, updatedAt: false })

const DeseaseMedication = sequelize.define('desease_medication', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { createdAt: false, updatedAt: false })

const DosageForm = sequelize.define('dosage_form', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, allowNull: false },
	dosage: { type: DataTypes.STRING, allowNull: false },
	application_mode: { type: DataTypes.TEXT, allowNull: false },
})

User.hasMany(FavoriteDesease);
FavoriteDesease.belongsTo(User);

User.hasMany(FavoriteMedication);
FavoriteMedication.belongsTo(User);

Desease.hasOne(FavoriteDesease);
FavoriteDesease.belongsTo(Desease);

Medication.hasOne(FavoriteMedication);
FavoriteMedication.belongsTo(Medication);

Symptom.belongsToMany(Desease, { through: DeseaseSymptom });
Desease.belongsToMany(Symptom, { through: DeseaseSymptom });

Diagnostic.belongsToMany(Desease, { through: DeseaseDiagnostic });
Desease.belongsToMany(Diagnostic, { through: DeseaseDiagnostic });

Medication.belongsToMany(Desease, { through: DeseaseMedication });
Desease.belongsToMany(Medication, { through: DeseaseMedication });

Desease.hasMany(Note, { as: 'notes' });
Note.belongsTo(Desease);

Medication.hasMany(DosageForm, { as: 'dosage_forms' });
DosageForm.belongsTo(Medication);

module.exports = {
	User,
	Desease,
	Medication,
	Symptom,
	Diagnostic,
	Note,
	FavoriteDesease,
	FavoriteMedication,
	DeseaseSymptom,
	DeseaseDiagnostic,
	DeseaseMedication,
	DosageForm
}