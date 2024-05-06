all: docker-compose.yml
	docker compose -f docker-compose.yml up --build

clean:
	docker compose -f docker-compose.yml down -v --rmi all --remove-orphans

fclean: clean
	docker image prune --force
	docker system prune --volumes --all --force
	docker network prune --force
	docker volume prune --force

.PHONY: all clean fclean
