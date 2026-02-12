import { prisma } from "./client";

async function main() {
	// Empresa
	await prisma.company.upsert({
		where: { id: 1 },
		update: {}, // não muda nada se já existir
		create: {
			id: 1,
			cnpj: "36931849000126",
			name: "Memphis & Pay",
			apiKey: "80fcf64e-bd3b-4835-afea-954b83ecb0c2",
		},
	});

	// Funcionário
	await prisma.employee.upsert({
		where: { id: 1 },
		update: {},
		create: {
			name: "Guilherme Nunes",
			cellphone: "5582996138682",
			cpf: "09606305465",
			dateOfBirth: "2002-08-13 06:00:00.000",
			lara_id: "599bf2d5-6c3b-4e23-a6a5-5890e39392c0",
			company_id: 1,
		},
	});

	// Endereço
	await prisma.address.upsert({
		where: { id: 1 }, // Se quiser chave única melhor usar zip+street+number
		update: {},
		create: {
			id: 1,
			zip: "05424150",
			city: "São Paulo",
			state: "SP",
			street: "R. Pais Leme",
			number: 215,
			complement: null,
		},
	});

	console.log("✅ Seed finalizado com sucesso!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
