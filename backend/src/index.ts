// backend/src/index.ts
import express from 'express';
import { prisma } from './lib/prisma';
import bcrypt from 'bcrypt';

const app = express();
const port = 3001;

// Middleware para o Express entender JSON no corpo das requisições
app.use(express.json());

// Rota principal (ainda podemos manter um "Olá Mundo")
app.get('/', (req, res) => {
    res.send('API do CGA está no ar!');
});

// backend/src/index.ts

// ... (imports e outras partes do código continuam iguais) ...

// Rota para cadastrar um novo usuário
app.post('/users', async (req, res) => {
    try {
        // 1. Pega os dados do corpo da requisição (agora com 'company')
        const { email, password, company } = req.body;

        // 2. Validação básica
        if (!email || !password || !company) {
            return res.status(400).json({ error: 'Email, password and company are required' });
        }

        // 3. Verifica se o usuário já existe
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // 4. Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Salva o novo usuário no banco de dados (agora com 'company')
        const newUser = await prisma.user.create({
            data: {
                email,
                company, // Salva o nome da empresa
                password: hashedPassword,
            },
        });

        // 6. Retorna o usuário criado (sem a senha!)
        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json(userWithoutPassword);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});

// ... (app.listen continua igual) ...
app.listen(port, () => {
    console.log(`Serviço de autenticação rodando em http://localhost:${port}`);
});