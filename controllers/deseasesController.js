const ApiError = require('../error/ApiError');
const { Desease, Symptom, Diagnostic, Medication, Note, DeseaseSymptom, DeseaseDiagnostic, DeseaseMedication } = require('../models/models');

async function initNodes(symptoms, diagnostics, medications, deseaseId) {
	symptoms = JSON.parse(symptoms)
	diagnostics = JSON.parse(diagnostics)
	medications = JSON.parse(medications)

	for (let s of symptoms) {
		await DeseaseSymptom.create({ symptomId: s, deseaseId: deseaseId });
	}

	for (let d of diagnostics) {
		await DeseaseDiagnostic.create({ diagnosticId: d, deseaseId: deseaseId });
	}

	for (let m of medications) {
		await DeseaseMedication.create({ medicationId: m, deseaseId: deseaseId });
	}
}

class DeseasesController {

	async create(req, res, next) {
		try {
			let { name, symptoms, diagnostics, medications } = req.body

			console.log('Fields: ' + [name, symptoms, diagnostics, medications])

			if (!name && !symptoms && !diagnostics && !medications)
				return next(ApiError.badRequest('Заполните все данные'))

			if (await Desease.findOne({ where: { name } })) return next(ApiError.badRequest('Заболевание существует'))

			const desease = await Desease.create({ name });

			await initNodes(symptoms, diagnostics, medications, desease.id);

			return res.json(desease)

		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async delete(req, res, next) {
		const { id } = req.params

		try {

			const result = await Desease.destroy({ where: { id } })

			await DeseaseSymptom.destroy({ where: { deseaseId: id } });
			await DeseaseDiagnostic.destroy({ where: { deseaseId: id } });
			await DeseaseMedication.destroy({ where: { deseaseId: id } });
			await Note.destroy({ where: { deseaseId: id } });

			if (result > 0) return res.json({ message: `Удалено ${result} заболеваний` })
			else return res.json({ message: 'Заболевание не найдено' })
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async getAll(req, res, next) {
		const deseases = await Desease.findAll({
			include: [
				{ model: Symptom, attributes: ['id', 'name'], through: { attributes: [] } },
				{ model: Diagnostic, attributes: ['id', 'name'], through: { attributes: [] } },
				{ model: Medication, attributes: ['id', 'name'], through: { attributes: [] } },
				{ model: Note, as: 'notes' },
			],
			order: [['name', 'asc']]
		});

		return res.json(deseases);
	}

	async getById(req, res, next) {
		const { id } = req.params

		const desease = await Desease.findByPk(id, {
			include: [
				{ model: Symptom, attributes: ['id', 'name'], through: { attributes: [] } },
				{ model: Diagnostic, attributes: ['id', 'name'], through: { attributes: [] } },
				{ model: Medication, attributes: ['id', 'name'], through: { attributes: [] } },
				{ model: Note, as: 'notes' },
			]
		});

		return res.json(desease);
	}

	async update(req, res, next) {
		const { id } = req.params

		try {
			let { name, symptoms, diagnostics, medications } = req.body

			console.log('ID: ' + id)
			console.log('NAME: ' + name)
			console.log('SYM: ' + symptoms)
			console.log('DIA: ' + diagnostics)
			console.log('MED: ' + medications)

			if (!name && !symptoms && !diagnostics && !medications && !notes)
				return next(ApiError.badRequest('Заполните все данные'))

			let desease = await Desease.update({ name }, { where: { id } });

			await DeseaseSymptom.destroy({ where: { deseaseId: id } });
			await DeseaseDiagnostic.destroy({ where: { deseaseId: id } });
			await DeseaseMedication.destroy({ where: { deseaseId: id } });

			await initNodes(symptoms, diagnostics, medications, id);

			desease = await Desease.findByPk(id, {
				include: [
					{ model: Symptom, attributes: ['id', 'name'], through: { attributes: [] } },
					{ model: Diagnostic, attributes: ['id', 'name'], through: { attributes: [] } },
					{ model: Medication, attributes: ['id', 'name'], through: { attributes: [] } },
					{ model: Note, as: 'notes' },
				]
			});

			return res.json(desease)

		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}
}

module.exports = new DeseasesController();