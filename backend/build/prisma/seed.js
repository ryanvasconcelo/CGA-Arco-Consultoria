"use strict";
// backend/prisma/seed.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Iniciando o processo de seed...');
    // 1. Limpar dados existentes (opcional, mas bom para garantir um estado limpo)
    // A ordem é importante para evitar erros de chave estrangeira
    await prisma.companyProduct.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.company.deleteMany({});
    // Não deletamos os produtos, pois eles são fixos
    console.log('Tabelas de User, Company e CompanyProduct limpas.');
    // 2. Criptografar uma senha padrão para os usuários
    const defaultPassword = await bcryptjs_1.default.hash('123456', 8);
    console.log('Senha padrão criada.');
    // 3. Criar uma empresa de teste
    const patosCompany = await prisma.company.create({
        data: {
            name: "Pato's Company LTDA",
            cnpj: '11222333000144',
            primaryColor: '#f59e0b', // <-- CORRIGIDO
            secondaryColor: '#1f2937', // <-- CORRIGIDO
        },
    });
    console.log(`Empresa de teste criada: ${patosCompany.name}`);
    // 4. Criar usuários
    const superAdmin = await prisma.user.create({
        data: {
            name: 'Super Pato Admin',
            email: 'superadmin@pato.com',
            password: defaultPassword,
            role: 'SUPER_ADMIN',
            // SUPER_ADMIN não pertence a uma empresa específica, então não conectamos
        },
    });
    console.log(`Usuário criado: ${superAdmin.name}`);
    const adminUser = await prisma.user.create({
        data: {
            name: 'Admin Pato',
            email: 'admin@pato.com',
            password: defaultPassword,
            role: 'ADMIN',
            companyId: patosCompany.id, // Conecta este usuário à Pato's Company
        },
    });
    console.log(`Usuário criado: ${adminUser.name}`);
    const normalUser = await prisma.user.create({
        data: {
            name: 'User Pato',
            email: 'user@pato.com',
            password: defaultPassword,
            role: 'USER',
            companyId: patosCompany.id, // Conecta este usuário à Pato's Company
        },
    });
    console.log(`Usuário criado: ${normalUser.name}`);
    // 5. Associar serviços (Products) à empresa de teste
    // Primeiro, pegamos os produtos que já existem no banco
    // DEPOIS
    const arcoPortus = await prisma.product.findUnique({ where: { name: 'Arco Portus' } });
    const guardControl = await prisma.product.findUnique({ where: { name: 'GuardControl' } });
    if (arcoPortus && guardControl) {
        await prisma.companyProduct.createMany({
            data: [
                { companyId: patosCompany.id, productId: arcoPortus.id },
                { companyId: patosCompany.id, productId: guardControl.id },
            ]
        });
        console.log(`Serviços associados à ${patosCompany.name}`);
    }
    else {
        console.warn('Não foi possível associar serviços. Produtos não encontrados.');
    }
    console.log('Seed finalizado com sucesso!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
