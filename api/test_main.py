from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from main import app  # Assuming the FastAPI app is in a file named main.py


client = TestClient(app)


@patch('main.conn')
def test_root(mock_connect):
    mysql = mock_connect
    cursor = mock_connect.cursor(dictionary=True)
    mysql.cursor.return_value = cursor
    cursor.fetchall.return_value = [{'id': 1, 'task': "Test Task"}]

    response = client.get("/")

    assert response.status_code == 200
    assert response.text == '{"message":"Hello World"}'


@patch('main.conn')
def test_add_task(mock_connect):
    mysql = mock_connect
    cursor = mock_connect.cursor(dictionary=True)
    mysql.cursor.return_value = cursor
    cursor.fetchall.return_value = [{'id': 3, 'task': "Test Task3"}]
    
    response = client.post("/add_task", data={'id': 3, 'task': "Test Task3"})

    assert response.status_code == 200
    assert response.text == '"Added Successfully"'
    
    assert mysql.cursor.call_count == 2
    assert cursor.execute.call_count == 1
    assert mysql.commit.call_count == 1
    assert cursor.fetchall.return_value == [{'id': 3, 'task': "Test Task3"}]
    cursor.execute.assert_called_with("insert into todo (task) values (%s)", ('Test Task3',))


@patch('main.conn')
def test_delete_task(mock_connect):
    mysql = mock_connect
    cursor = mock_connect.cursor(dictionary=True)
    mysql.cursor.return_value = cursor
    cursor.fetchall.return_value = [{'id': 2, 'task': "Test Task2"}]

    response = client.post("/delete_task", data={'id': 1})

    assert response.text == '"Deleted Successfully"'
    assert response.status_code == 200

    assert mysql.cursor.call_count == 2
    assert cursor.execute.call_count == 1
    assert mysql.commit.call_count == 1
    assert cursor.fetchall.return_value == [{'id': 2, 'task': "Test Task2"}]
    cursor.execute.assert_called_with('delete from todo where id=%s', ('1',))


@patch('main.conn')
def test_get_tasks(mock_connect):
    mysql = mock_connect
    cursor = mock_connect.cursor(dictionary=True)
    mysql.cursor.return_value = cursor
    cursor.fetchall.return_value = [{'id': 1, 'task': "Test Task"}]

    response = client.get("/get_tasks")

    assert response.status_code == 200
    assert response.text == '[{"id":1,"task":"Test Task"}]'

    assert mysql.cursor.call_count == 2
    assert cursor.fetchall.call_count == 1
    cursor.execute.assert_called_once()
    cursor.execute.assert_called_with('select * from todo')