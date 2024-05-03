all: docker-compose.yml
	docker compose -f docker-compose.yml up --build

fclean:
	docker image prune --force
	docker system prune --volumes --all --force
	docker network prune --force
	docker volume prune --force

.PHONY: all clean fclean
