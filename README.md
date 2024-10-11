A todo app created with Python as backend and Angular front end which uses mysql server database.

To test, create a database in Workbench called mydb and create a table as per below:

create table todo (
id int auto_increment, 
task char(100),
primary key(id)
)

Run "python3 -m uvicorn main:app --reload" to start api 

and "ng serve -o" to start ui.


<img width="641" alt="image" src="https://github.com/user-attachments/assets/5b4d5680-a1b7-4c74-9699-c5e538f863c8">

