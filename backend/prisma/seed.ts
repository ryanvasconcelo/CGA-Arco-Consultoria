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
    const defaultPassword = await bcrypt.hash('123456', 10);
    console.log('Senha padrão criada.');

    // Criar empresa do sistema para o Super Admin (nosso contorno)
    const systemCompany = await prisma.company.create({
        data: {
            name: 'Arco System Internal',
            cnpj: '00000000000000',
            primaryColor: '#cccccc',
            secondaryColor: '#333333',
        },
    });

    const patosCompany = await prisma.company.create({
        data: {
            name: "Pato's Company LTDA",
            cnpj: '11222333000144',
            primaryColor: '#f59e0b',
            secondaryColor: '#1f2937',
        },
    });
    console.log(`Empresas de teste criadas: ${systemCompany.name}, ${patosCompany.name}`);

    // Criar usuários
    const superAdmin = await prisma.user.create({
        data: {
            name: 'Super Admin',
            email: 'superadmin@arco.com',
            password: defaultPassword,
            role: 'SUPER_ADMIN',
            passwordResetRequired: false, // Super admin não precisa resetar a senha
            companyId: systemCompany.id,
        },
    });

    const adminUser = await prisma.user.create({
        data: {
            name: 'Admin Pato',
            email: 'admin@pato.com',
            password: defaultPassword,
            role: 'ADMIN',
            passwordResetRequired: false, // Admin de teste não precisa resetar a senha
            companyId: patosCompany.id,
        },
    });

    const normalUser = await prisma.user.create({
        data: {
            name: 'User Pato',
            email: 'user@pato.com',
            password: defaultPassword,
            role: 'USER',
            companyId: patosCompany.id,
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

    async function main() {
    console.log('Iniciando o processo de seed...');

    // ⚠️ IMPORTANTE: Só limpa dados em desenvolvimento
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
        console.warn('⚠️ SEED EM PRODUÇÃO: Pulando limpeza de dados para preservar informações existentes.');
    }

    // --- ETAPA 1: Criar/Atualizar os Produtos (Sua lógica original) ---
    console.log('Criando ou atualizando produtos...');
    for (const product of products) {
        const createdProduct = await prisma.product.upsert({
            where: { name: product.name },
            update: { description: product.description },
            create: {
                name: product.name,
                description: product.description,
            },
        });
        console.log(`Produto criado ou atualizado: ${createdProduct.name}`);
    }

    // Permissões...
    console.log('Criando ou atualizando permissões...');
    // ... código das permissões ...

    // --- ETAPA 2: Limpar dados APENAS EM DESENVOLVIMENTO ---
    if (!isProduction) {
        console.log('🧹 Limpando dados de teste...');
        await prisma.userPermission.deleteMany({});
        await prisma.userProduct.deleteMany({});
        await prisma.companyProduct.deleteMany({});
        await prisma.user.deleteMany({});
        await prisma.company.deleteMany({});
        console.log('Tabelas limpas.');
    } else {
        console.log('✅ Modo produção: mantendo dados existentes.');
    }

    // --- ETAPA 3: Criar empresas/usuários APENAS SE NÃO EXISTIREM ---
    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@pato.com' }
    });

    if (existingAdmin) {
        console.log('✅ Usuário admin@pato.com já existe. Pulando criação de dados de teste.');
        return;
    }

    // Só cria se não existir...
    const defaultPassword = await bcrypt.hash('123456', 10);
    // ... resto do código de criação ...
}