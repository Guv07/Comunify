const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

async function createUser(req, res) {
    const { email, senha } = req.body;

    try {
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: senha
            },
            select: { id: true, email: true }
        })

        if (newUser.id) {
            return res.status(201).json({message: "Usuário criado"})
        }
    } catch (error) {
        return res.status(500).json({erro: error})
    }
}

async function signIn(req, res) {
    const { email, senha } = req.body;

    try {
        const user = await prisma.user.find({
            where: {
                email: email,
                password: senha
            }
        })

        
    } catch (error) {
        return res.status(500).json({erro: error})
    }
}

module.exports = {
    createUser
}