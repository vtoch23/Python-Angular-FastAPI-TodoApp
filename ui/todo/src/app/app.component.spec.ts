import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  let httpTestingController: HttpTestingController;
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController); // Inject HttpTestingController
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = new AppComponent(TestBed.inject(HttpClient));
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create app', () => {
    expect(app).toBeTruthy();
  });

  it('app title should be "todo"', () => {
    expect(app.title).toEqual('todo');
  });

  it('should render title', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('title')?.textContent).toContain('My Todo App');
  });

  it('should fetch tasks successfully from the API', () => {
    const mockTasks = [
      { id: 1, task: 'Task 1' },
      { id: 2, task: 'Task 2' }
    ];

    app.get_tasks(); // Call the method

    const req = httpTestingController.expectOne(app.APIURL + 'get_tasks');
    expect(req.request.method).toBe('GET');

    req.flush(mockTasks);

    expect(app.tasks).toEqual(mockTasks);
  });

  it('should add a new task and refresh the task list', () => {
    const newTask = 'New Task';
    app.newTask = newTask;

    app.add_task();

    const req = httpTestingController.expectOne(app.APIURL + 'add_task');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.get('task')).toBe(newTask);

    req.flush({ success: true });

    const refreshReq = httpTestingController.expectOne(app.APIURL + 'get_tasks');
    expect(refreshReq.request.method).toBe('GET');

    const mockTasks = [
      { id: 1, task: 'Task 1' },
      { id: 2, task: newTask }
    ];
    refreshReq.flush(mockTasks);

    expect(app.tasks).toEqual(mockTasks);
    expect(app.newTask).toBe('');
  });

  it('should alert if adding a task without input', () => {
    spyOn(window, 'alert');
    app.newTask = '';

    app.add_task();

    httpTestingController.expectNone(app.APIURL + 'add_task');

    expect(window.alert).toHaveBeenCalledWith('Please enter a task');
  });

  it('should delete a task and refresh the task list', () => {
    const taskId = 1;

    app.delete_task(taskId);

    const req = httpTestingController.expectOne(app.APIURL + 'delete_task');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.get('id')).toBe(taskId.toString());

    req.flush({ success: true });

    const refreshReq = httpTestingController.expectOne(app.APIURL + 'get_tasks');
    expect(refreshReq.request.method).toBe('GET');

    const mockTasks = [
      { id: 2, task: 'Task 2' }
    ];
    refreshReq.flush(mockTasks);

    expect(app.tasks).toEqual(mockTasks);
  });
});

