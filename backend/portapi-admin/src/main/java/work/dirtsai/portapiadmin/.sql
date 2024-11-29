use portapi_db;
create table api_info (
                          id int primary key auto_increment,
                          name varchar(255),
                          url varchar(255),
                          method varchar(255),
                          description varchar(255),
                          status int,
                          headers varchar(255),
                          params varchar(255),
                          response varchar(255),
                          create_time datetime,
                          update_time datetime
);