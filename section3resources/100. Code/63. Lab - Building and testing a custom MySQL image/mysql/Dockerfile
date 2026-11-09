# mysql/Dockerfile
FROM mysql:8.4

# These ENV values are read by the official MySQL entrypoint at container start.
ENV MYSQL_DATABASE=coursesdb \
    MYSQL_ROOT_PASSWORD=Passw0rd! \
    MYSQL_USER=appuser \
    MYSQL_PASSWORD=appPassw0rd!

# Any .sql or .sh dropped here runs exactly once on first startup (when the data dir is empty).
COPY init/ /docker-entrypoint-initdb.d/