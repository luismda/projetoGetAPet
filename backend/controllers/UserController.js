const User = require('../models/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjetctId = require('mongoose').Types.ObjectId

class UserController {
    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        // validations
        if (!name) {
            res.status(422).json({ message: 'Por favor, informe o seu nome.' })
            return
        }

        if (!email) {
            res.status(422).json({ message: 'Por favor, informe o seu e-mail.' })
            return
        }

        if (!phone) {
            res.status(422).json({ message: 'Por favor, informe o seu telefone.' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'Por favor, informe a sua senha.' })
            return
        }

        if (!confirmpassword) {
            res.status(422).json({ message: 'Por favor, informe a confirmação da senha.' })
            return
        }

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'Por favor, informe as senhas corretamente.' })
            return
        }

        const emailExists = await User.findOne({ email: email })

        if (emailExists) {
            res.status(422).json({ message: 'Por favor, informe outro e-mail.' })
            return
        }

        // create user
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user  = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save()

            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        if (!email) {
            res.status(422).json({ message: 'Por favor, informe o seu e-mail.' })
            return
        }

        if (!password) {
            res.status(422).json({ message: 'Por favor, informe a sua senha.' })
            return
        }

        const user = await User.findOne({ email: email })

        if (!user) {
            res.status(422).json({ message: 'E-mail ou senha inválidos.' })
            return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            res.status(422).json({ message: 'E-mail ou senha inválidos.' })
            return
        }

        await createUserToken(user, req, res)
    }

    static async checkuser(req, res) {
        let currentUser

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.decode(token, 'getapetsecret')

            currentUser = await User.findById(decoded.userId).select('-password')
        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        if (!ObjetctId.isValid(id)) {
            res.status(422).json({ message: 'Parâmetro inválido.' })
            return
        }

        const user = await User.findById(id).select('-password')

        if (!user) {
            res.status(404).json({ message: 'O usuário não existe.' })
            return
        }

        res.status(200).json(user)
    }

    static async editUser(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (!name) {
            res.status(422).json({ message: 'Por favor, informe o seu nome.' })
            return
        }

        user.name = name

        if (!email) {
            res.status(422).json({ message: 'Por favor, informe o seu e-mail.' })
            return
        }

        if (user.email !== email) {
            const emailExists = await User.findOne({ email: email })

            if (emailExists) {
                res.status(422).json({ message: 'Por favor, informe outro e-mail.' })
                return
            }
        }

        user.email = email

        if (!phone) {
            res.status(422).json({ message: 'Por favor, informe seu telefone.' })
            return
        }

        user.phone = phone

        if (password) {
            if (!confirmpassword || password !== confirmpassword) {
                res.status(422).json({ message: 'Por favor, informe as senhas corretamente.' })
                return
            }

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)
    
            user.password = passwordHash
        }

        if (req.file) {
            user.image = req.file.filename
        }

        try {
            await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true })
            res.status(200).json({ message: 'Usuário alterado com sucesso!' })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }
}

module.exports = UserController