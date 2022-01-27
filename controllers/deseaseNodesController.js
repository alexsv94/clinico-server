const ApiError = require('../error/ApiError');
const { Symptom, Diagnostic, Note } = require('../models/models');

class DeseaseNodesController {

	async createSymptom(req, res, next) {
		const { name } = req.body

		if (!name) return next(ApiError.badRequest('Название не может быть пустым'))

		if (await Symptom.findOne({ where: { name } })) return next(ApiError.badRequest(`Симптом «${name}» существует`))

		const symptom = await Symptom.create({ name });
		return res.json({ message: `Симптом «${symptom.name}» добавлен` });
	}

	async createDiagnostics(req, res, next) {
		const { name } = req.body

		if (!name) return next(ApiError.badRequest('Название не может быть пустым'))

		if (await Diagnostic.findOne({ where: { name } })) return next(ApiError.badRequest(`Метод диагностики «${name}» существует`))

		const method = await Diagnostic.create({ name });
		return res.json({ message: `Метод диагностики «${method}» добавлен` });
	}

	async updateSymptom(req, res, next) {
		const { id } = req.params
		const { name } = req.body

		if (!name) return next(ApiError.badRequest('Название не может быть пустым'))

		const oldSymptom = await Symptom.findByPk(id)
		await Symptom.update({ name }, { where: { id } })

		return res.json({ message: `Название симптома изменено: «${oldSymptom.name}» → «${name}»` });
	}

	async deleteSymptom(req, res, next) {
		const { id } = req.params

		if (!id) return next(ApiError.badRequest('Не указан Id'))

		const symptom = await Symptom.findByPk(id);
		if (!symptom) return next(ApiError.badRequest('Симптом не найдем по указанному Id'))

		const result = await Symptom.destroy({ where: { id } })

		return res.json({ message: `Симптом «${symptom.name}» удален` })
	}

	async updateDiagnostic(req, res, next) {
		const { id } = req.params
		const { name } = req.body

		if (!name) return next(ApiError.badRequest('Название не может быть пустым'))

		await Diagnostic.update({ name }, { where: { id } })

		return res.json({ message: `Название метода диагностики изменено: «${oldSymptom.name}» → «${name}»` });
	}

	async deleteDiagnostic(req, res, next) {
		const { id } = req.params

		if (!id) return next(ApiError.badRequest('Не указан Id'))

		if (!await Diagnostic.findByPk(id)) return next(ApiError.badRequest('Метод диагностики не найдем по указанному Id'))

		const result = await Diagnostic.destroy({ where: { id } })

		return res.json({ message: `Удалено ${result} методов диагностики` })
	}

	async getSymptoms(req, res) {
		const symptoms = await Symptom.findAll({ order: [['name', 'asc']] });
		return res.json(symptoms);
	}

	async getDiagnostics(req, res) {
		const diagnostics = await Diagnostic.findAll({ order: [['name', 'asc']] });
		return res.json(diagnostics);
	}
}

module.exports = new DeseaseNodesController();