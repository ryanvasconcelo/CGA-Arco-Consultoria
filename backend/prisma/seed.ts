// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lista fixa de serviços da sua empresa
const products = [
    { name: "Accia", description: "Sistema de Gestão e Análise de Risco de Segurança Corporativa" },
    { name: "Guard Control", description: "Gestão e Controle de Equipamento e Operações de Segurança e Facilities em tempo real" },
    { name: "Arco View", description: "Solução de Monitoramento por Drones Automatizados" },
    { name: "Arcomoki", description: "Sistema de Formulários Eletrônicos para Gestão de Processos e Controle de Qualidade" },
    { name: "Unicasp", description: "Sua Plataforma de Educação Corporativa para Capacitação e Aprendizado de Equipes" },
    { name: "Arco Portus", description: "Plataforma de Gerenciamento de Operações de Segurança Portuária e Controle de Acesso" },
];

async function main() {
    console.log(`Iniciando o seeding...`);

    for (const product of products) {
        // 'upsert' é uma operação segura:
        // ele tenta encontrar um serviço com o mesmo nome.
        // Se encontrar, ele o atualiza. Se não, ele o cria.
        // Isso evita criar serviços duplicados se rodarmos o seed mais de uma vez.
        const createdproduct = await prisma.product.upsert({
            where: { name: product.name },
            update: {},

            create: {
                name: product.name,
                description: product.description,
            },
        });
        console.log(`Serviço criado ou atualizado: ${createdproduct.name}`);
    }

    console.log(`Seeding finalizado.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });