// backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Lista fixa de produtos (do seu script original)
const products = [
    { name: "Accia", description: "Sistema de Gestão e Análise de Risco de Segurança Corporativa" },
    { name: "Guard Control", description: "Gestão e Controle de Equipamento e Operações de Segurança e Facilities em tempo real" },
    { name: "Arco View", description: "Solução de Monitoramento por Drones Automatizados" },
    { name: "Arcomoki", description: "Sistema de Formulários Eletrônicos para Gestão de Processos e Controle de Qualidade" },
    { name: "Unicasp", description: "Sua Plataforma de Educação Corporativa para Capacitação e Aprendizado de Equipes" },
    { name: "Arco Portus", description: "Plataforma de Gerenciamento de Operações de Segurança Portuária e Controle de Acesso" },
];

async function main() {
    console.log('Iniciando o processo de seed...');

    // --- ETAPA 1: Criar/Atualizar os Produtos (Sua lógica original) ---
    console.log('Criando ou atualizando produtos...');
    for (const product of products) {
        const createdProduct = await prisma.product.upsert({
            where: { name: product.name },
            update: { description: product.description }, // Garante que a descrição seja atualizada
            create: {
                name: product.name,
                description: product.description,
            },
        });
        console.log(`Produto criado ou atualizado: ${createdProduct.name}`);
    }

    // backend/prisma/seed.ts (dentro da função main)

    console.log('Criando ou atualizando permissões...');
    const permissions = [
        { action: 'VIEW', subject: 'DOCUMENTS' },
        { action: 'EDIT', subject: 'DOCUMENTS' },
        { action: 'CREATE', subject: 'DOCUMENTS' },
        { action: 'DELETE', subject: 'DOCUMENTS' },
        { action: 'VIEW', subject: 'DIAGNOSTIC' },
        { action: 'VIEW', subject: 'NORMS' },
        { action: 'VIEW', subject: 'REGISTERS' },
        { action: 'VIEW', subject: 'DASHBOARDS' },
        { action: 'VIEW', subject: 'LEGISLATION' },
        { action: 'VIEW', subject: 'CFTV' },
    ];

    for (const p of permissions) {
        await prisma.permission.upsert({
            where: { action_subject: { action: p.action, subject: p.subject } },
            update: {},
            create: p,
        });
    }
    console.log('Permissões básicas criadas.');

    // ... resto do seu script de seed ...

    // --- ETAPA 2: Limpar dados de teste antigos ---
    // A ordem é importante para evitar erros de chave estrangeira
    await prisma.userPermission.deleteMany({}); // <-- ADICIONE ESTA LINHA
    await prisma.userProduct.deleteMany({});
    await prisma.companyProduct.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.company.deleteMany({});
    console.log('Tabelas de dependência (UserPermission, UserProduct, CompanyProduct) e principais (User, Company) limpas.');

    // --- ETAPA 3: Criar Empresas e Usuários de Teste ---
    const defaultPassword = await bcrypt.hash('123456', 6);
    console.log('Senha padrão criada.');

    // Criar empresa do sistema para o Super Admin (nosso contorno)
    const systemCompany = await prisma.company.create({
        data: {
            name: "PK Tech",
            cnpj: '00000000000000',
            primaryColor: '#cccccc',
            secondaryColor: '#333333',
        },
    });

    const patosCompany = await prisma.company.create({
        data: {
            name: 'Arco Consultoria',
            cnpj: '30643481000114',
            primaryColor: '#f59e0b',
            secondaryColor: '#1f2937',
        },
    });
    console.log(`Empresas de teste criadas: ${systemCompany.name}, ${patosCompany.name}`);

    // Criar usuários
    const superAdmin = await prisma.user.create({
        data: {
            name: 'Edil Magno',
            email: 'administracao@consultoriaarco.com.br',
            password: defaultPassword,
            role: 'SUPER_ADMIN',
            passwordResetRequired: true, // Super admin não precisa resetar a senha
            companyId: patosCompany.id,
        },
    });

    const superAdmin3 = await prisma.user.create({
        data: {
            name: 'Marco Trindade',
            email: 'marco.trindade@consultoriaarco.com.br',
            password: defaultPassword,
            role: 'SUPER_ADMIN',
            passwordResetRequired: true, // Super admin não precisa resetar a senha
            companyId: patosCompany.id,
        },
    });

    const superAdmin2 = await prisma.user.create({
        data: {
            name: 'Ryan Richard Vasconcelo',
            email: 'ryancdz9@gmail.com',
            password: defaultPassword,
            role: 'SUPER_ADMIN',
            passwordResetRequired: true, // Super admin não precisa resetar a senha
            companyId: systemCompany.id,
        },
    });
    console.log('Usuários de teste criados.');

    // --- ETAPA 4: Associar Produtos à Empresa de Teste ---
    const arcoPortusProduct = await prisma.product.findUnique({ where: { name: 'Arco Portus' } });
    const guardControlProduct = await prisma.product.findUnique({ where: { name: 'Guard Control' } });

    if (arcoPortusProduct && guardControlProduct) {
        // Associa Arco Portus a TODAS as empresas e Guard Control apenas à Pato's Company
        await prisma.companyProduct.createMany({
            data: [
                { companyId: patosCompany.id, productId: arcoPortusProduct.id },
                { companyId: patosCompany.id, productId: guardControlProduct.id },
                { companyId: systemCompany.id, productId: arcoPortusProduct.id }, // Garante que a empresa do sistema também tenha Arco Portus
            ]
        });
        console.log(`Serviços associados às empresas de teste.`);
    } else {
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