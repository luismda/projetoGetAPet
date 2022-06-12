const Pet = require('../models/Pet')

const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

class PetController {
    static async create(req, res) {
        const { name, age, weight, color } = req.body

        const available = true

        const images = req.files

        if (!name) {
            res.status(422).json({ message: 'Por favor, informe o nome do pet.' })
            return
        }

        if (!age) {
            res.status(422).json({ message: 'Por favor, informe a idade do pet.' })
            return
        }

        if (!weight) {
            res.status(422).json({ message: 'Por favor, informe o peso do pet.' })
            return
        }

        if (!color) {
            res.status(422).json({ message: 'Por favor, informe a cor do pet.' })
            return
        }

        if (!images || images.length === 0) {
            res.status(422).json({ message: 'Por favor, envie pelo menos uma imagem do pet.' })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        const sendedImages = images.map(image => image.filename)

        const pet = new Pet({
            name,
            age, 
            weight,
            color,
            available,
            images: sendedImages,
            user: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
                image: user.image
            }
        })

        try {
            const newPet = await pet.save()
            res.status(201).json({ 
                message: 'Pet cadastrado com sucesso!',
                newPet
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({ pets })
    }

    static async getAllUserPets(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')

        res.status(200).json({ pets })
    }

    static async getAllUserAdoptions(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')

        res.status(200).json({ pets })
    }

    static async getPetById(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Parâmetro inválido.' })
            return
        }

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado.' })
            return
        }

        res.status(200).json({ pet })
    }

    static async removePetById(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Parâmetro inválido.' })
            return
        }

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado.' })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema na sua solicitação, tente novamente mais tarde.' })
            return
        }

        await Pet.findByIdAndRemove(id)

        res.status(200).json({ message: 'Pet removido com sucesso!' })
    }

    static async updatePetById(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Parâmetro inválido.' })
            return
        }

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado.' })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema na sua solicitação, tente novamente mais tarde.' })
            return
        }

        const { name, age, weight, color, available } = req.body

        const images = req.files

        if (!name) {
            res.status(422).json({ message: 'Por favor, informe o nome do pet.' })
            return
        }

        if (!age) {
            res.status(422).json({ message: 'Por favor, informe a idade do pet.' })
            return
        }

        if (!weight) {
            res.status(422).json({ message: 'Por favor, informe o peso do pet.' })
            return
        }

        if (!color) {
            res.status(422).json({ message: 'Por favor, informe a cor do pet.' })
            return
        }

        if (!available) {
            res.status(422).json({ message: 'Por favor, informe a disponibilidade de adoção do pet.' })
            return
        }

        const newPet = {
            name, 
            age, 
            weight,
            color, 
            available, 
        }

        if (images.length > 0) {
            const sendedImages = images.map(image => image.filename)
            newPet.images = sendedImages
        }

        await Pet.findByIdAndUpdate(id, newPet)

        res.status(200).json({ message: 'Pet atualizado com sucesso!' })
    }

    static async schedule(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Parâmetro inválido.' })
            return
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            res.status(404).json({ message: 'O pet não existe.' })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.equals(user._id)) {
            res.status(422).json({ message: 'Você não pode agendar uma visita com seu próprio pet.' })
            return
        }

        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                res.status(422).json({ message: 'Você já agendou uma visita com esse pet.' })
                return
            }
        }

        pet.adopter = {
            _id: user._id,
            name: user.name,
            phone: user.phone,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({ 
            message: `Visita agendada com sucesso, entre em contato com ${user.name} pelo telefone ${user.phone}.` 
        })
    }

    static async concludeAdoption(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'Parâmetro inválido.' })
            return
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            res.status(404).json({ message: 'O pet não existe.' })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Houve um problema na sua solicitação, tente novamente mais tarde.' })
            return
        }

        if (!pet.available) {
            res.status(422).json({ message: 'O ciclo de adoção desse pet já foi concluído.' })
            return
        }

        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({ message: 'O ciclo de adoção do pet foi concluído com sucesso.' })
    }
}

module.exports = PetController