const ApiError = require('../error/ApiError');
const { Note, Desease } = require('../models/models');

class NotesController {

	async create(req, res, next) {
		try {
			const deseaseId = req.originalUrl.split('/')[3]

			console.log(deseaseId)

			if (!await Desease.findByPk(deseaseId)) return next(ApiError.badRequest('Заболевание не найдено'))

			let author = req.user.firstname + ' ' + req.user.lastname
			let { content } = req.body

			if (!content)
				return next(ApiError.badRequest('Пустой комментарий'))

			const note = await Note.create({ author, content, deseaseId });

			return res.json(note)

		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async delete(req, res, next) {
		const { id } = req.params

		try {
			const note = await Note.findByPk(id)

			if (req.user.email !== note.author || req.user.role !== 'ADMIN')
				return next(ApiError.badRequest('Доступ запрещен'))

			const result = await Note.destroy({ where: { id } })

			if (result > 0) return res.json({ message: 'Успешно' })
			else return res.json({ message: 'Комментарий не найден' })
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async update(req, res, next) {
		const { id } = req.params
		const { content } = req.body

		try {
			const note = await Note.findByPk(id)

			if (req.user.email !== note.author)
				return next(ApiError.badRequest('Доступ запрещен'))

			if (!content) return next(ApiError.badRequest('Пустой комментарий'))

			const result = await Note.update({ content }, { where: { id } })

			if (result === 0) return res.json({ message: 'Комментарий не найден' })

			const updatedNote = await Note.findByPk(id)

			return res.json(updatedNote)

		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}
}

module.exports = new NotesController();