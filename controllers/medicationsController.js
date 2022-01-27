const ApiError = require('../error/ApiError');
const { Medication, DosageForm, ApplicationMode } = require('../models/models');
const uuid = require('uuid');
const path = require('path');
const { Console } = require('console');

class MedicationsController {
	async create(req, res, next) {
		try {
			let { name, indications, contrindications, dosage } = req.body
			//const { img } = req.files

			if (!name || !indications || !contrindications || !dosage)
				return next(ApiError.badRequest('Заполните все данные'))

			//let fileName = img ? uuid.v4() + ".jpg" : '';
			//img?.mv(path.resolve(__dirname, '..', 'static', fileName));

			const duplicate = await Medication.findOne({ where: { name } })

			if (duplicate) return next(ApiError.badRequest('Препарат уже есть в базе'))

			const medication = await Medication.create({
				name, indications, contrindications, img: ''
			});

			if (dosage) {
				dosage = JSON.parse(dosage);
				dosage.forEach(async (i) => {
					await DosageForm.create({
						name: i.name,
						dosage: i.dosage,
						medicationId: medication.id,
						application_mode: i.application_mode
					})
					console.log('DOGAGE' + i)
				});
			}

			return res.json(medication)

		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async delete(req, res, next) {
		try {
			const { id } = req.params

			const count = await Medication.destroy({ where: { id } });

			if (count < 1) return next(ApiError.badRequest('Лек. препарат не существует'))

			await DosageForm.destroy({ where: { medicationId: id } });

			return res.json({ message: `Удалено записей: ${count}` });

		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async update(req, res, next) {
		try {
			const { id } = req.params
			let { name, indications, contrindications, dosage } = req.body
			//const { img } = req.files

			if (!name || !indications || !contrindications || !dosage)
				return next(ApiError.badRequest('Заполните все данные'))

			//let fileName = img ? uuid.v4() + ".jpg" : '';
			//img?.mv(path.resolve(__dirname, '..', 'static', fileName));

			const [medication, model] = await Medication.update({ name, indications, contrindications, img: '' }, { where: { id } });

			if (medication < 1) return next(ApiError.badRequest('Препарата нет в базе'))

			await DosageForm.destroy({ where: { medicationId: id } });

			if (dosage) {
				dosage = JSON.parse(dosage);
				dosage.forEach(async (i) => {
					await DosageForm.create({
						name: i.name,
						dosage: i.dosage,
						medicationId: id,
						application_mode: i.application_mode
					})
					console.log('DOGAGE' + i)
				});
			}

			return res.json('Успешно')

		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async getAll(req, res, next) {
		const medications = await Medication.findAll({
			include: [{ model: DosageForm, as: 'dosage_forms' }],
			order: [['name', 'asc']]
		})
		return res.json(medications);
	}

	async getById(req, res, next) {
		const { id } = req.params

		const medication = await Medication.findByPk(id, {
			include: [
				{ model: DosageForm, as: 'dosage_forms' },
			]
		});

		if (!medication) return next(ApiError.badRequest('Лек. препарат не существует'))

		return res.json(medication);
	}
}

module.exports = new MedicationsController();