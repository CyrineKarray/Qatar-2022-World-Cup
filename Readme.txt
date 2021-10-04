export database:
pg_dump -U postgres --no-owner formations > worldcup.sql

import database:
drop database formations WITH(FORCE);
create database formations;
psql -U postgres formations < worldcup.sql

Admin:
login:medaliyacoubi
pswd:01060789

Mod:
login:medalimod
pswd:01060789