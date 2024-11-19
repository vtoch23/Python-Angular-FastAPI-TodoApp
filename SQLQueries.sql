create table todo (
id int auto_increment, 
task char(100),
primary key(id)
)

select * from todo

select * from todo where task="buy veggies"

insert into todo (id, task) values (1, "do something")

insert into todo (task) values ('buy books')
update todo set task=replace(task, "stuff", "things") where id = 8
update todo set id=replace(id, 10, 2) where id = 10
update todo set task=replace(task, "tomatoes", "apples") where id = 5