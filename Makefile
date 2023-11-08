commands:
	yarn create next-app nextjs-server-action-app
	# Prisma
	yarn prisma init --datasource-provider sqlite
	yarn prisma migrate dev --name 'initial migration'                

packages:
	yarn add -D prisma 
	yarn add @prisma/client
	yarn add zod react-hook-form @hookform/resolvers
	